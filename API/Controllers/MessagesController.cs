using System;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.interfaces;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
[Authorize]
public class MessagesController(IMessageRepository messageRepository , IUserRepositry userRepositry , IMapper mapper):BaseApiController
{


    [HttpPost]
    public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto){

        var username = User.GetUsername();

        if(username == createMessageDto.RecipientUsername.ToLower())
            return BadRequest("Cannot send urself a message");



        var sender = await userRepositry.GetUsersByUsernameAsync(username);
        var recipient = await userRepositry.GetUsersByUsernameAsync(createMessageDto.RecipientUsername);


        if (sender == null || recipient ==null || sender.UserName == null || recipient.UserName == null)
        {
            return BadRequest("Cannot Send Message");
            
        }


        var message = new Message{
            Sender = sender,
            Recipient = recipient,
            SenderUsername = sender.UserName,
            RecipientUsername = recipient.UserName,
            Content = createMessageDto.Content
            
        };

        messageRepository.AddMessage(message);


        if(await messageRepository.SaveAllAsync())return Ok(mapper.Map<MessageDto>(message));
        return BadRequest("Failed to save message");
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageForUser([FromQuery] MessageParams messageParams){
        messageParams.Username = User.GetUsername();

        var messages = await messageRepository.GetMessageForUser(messageParams);
        Response.AddPaginationHeaders(messages);

        return messages;
    }


    [HttpGet("thread/{username}")]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username){
        var currentUsername = User.GetUsername();

        var messages = await messageRepository.GetMessageThread(currentUsername,username);

        return Ok(messages);
    }



    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMessage(int id){
        var username = User.GetUsername();
        var message = await messageRepository.GetMessage(id);

        if (message == null) return BadRequest("cannot delete this msdg");

        if (message.SenderUsername != username && message.RecipientUsername != username) return Forbid();
        

        if (message.SenderUsername == username ) message.SenderDeleted  = true;
        if (message.RecipientUsername == username ) message.RecipientDeleted  = true;

        if (message is {SenderDeleted:true , RecipientDeleted:true})
        {
             messageRepository.DeleteMessage(message);
        }


        if(await messageRepository.SaveAllAsync()) return Ok();
        return BadRequest("something bad happend during deletetion :(");
            
        
    }
}
