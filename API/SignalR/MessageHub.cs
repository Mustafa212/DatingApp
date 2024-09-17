using System;
using API.DTOs;
using API.Entities;
using API.interfaces;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class MessageHub(IMessageRepository messageRepository , IUserRepositry userRepositry , IMapper mapper , IHubContext<PresenceHub> presenceHub):Hub
{
    public override async Task OnConnectedAsync()
    {
       var httpContext = Context.GetHttpContext();
       var otherUser = httpContext?.Request.Query["user"];
       if(Context.User == null || string.IsNullOrEmpty(otherUser)) throw new Exception("cannot join group");
       var groupName = GetGroupName(Context.User.GetUsername(),otherUser);

       await Groups.AddToGroupAsync(Context.ConnectionId,groupName);
       var group  = await AddToGroup(groupName);
        await Clients.Group(groupName).SendAsync( "UpdatedGroup", group);
       var messages = messageRepository.GetMessageThread(Context.User.GetUsername(),otherUser!);
       await Clients.Caller.SendAsync("RecievedMessageThread" , messages);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var group = await RemoveFromMessageGroup();
        await Clients.Group(group.Name).SendAsync( "UpdatedGroup", group);

        await base.OnDisconnectedAsync(exception);
    }
    public async Task SendMessage(CreateMessageDto createMessageDto)
    {

        var username = Context.User?.GetUsername()?? throw new Exception("cannot find user");

        if(username == createMessageDto.RecipientUsername.ToLower())
            throw new HubException("Cannot send urself a message");



        var sender = await userRepositry.GetUsersByUsernameAsync(username);
        var recipient = await userRepositry.GetUsersByUsernameAsync(createMessageDto.RecipientUsername);


        if (sender == null || recipient ==null || sender.UserName == null || recipient.UserName == null)
        {
            throw new HubException("Cannot Send Message");
            
        }


        var message = new Message{
            Sender = sender,
            Recipient = recipient,
            SenderUsername = sender.UserName,
            RecipientUsername = recipient.UserName,
            Content = createMessageDto.Content
            
        };

        var groupName = GetGroupName(sender.UserName , recipient.UserName);
        var group = await messageRepository.GetMessageGroup(groupName);

        if (group !=null && group.Connections.Any(x => x.UserName == recipient.UserName))
        {
            message.DateRead = DateTime.UtcNow;
        }
        else
        {
            var connections = await PresenceTracker.GetConnectionsForUser(recipient.UserName);
            if (connections != null && connections?.Count != null)
            {
                await presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived",
                    new {
                        username = sender.UserName,
                        knownAs = sender.KnownAs
                    });
            }
        }
        messageRepository.AddMessage(message);


        if(await messageRepository.SaveAllAsync()){
            await Clients.Group(groupName).SendAsync("NewMessage",mapper.Map<MessageDto>(message));
        }
    }


    private async Task<Group> AddToGroup(string groupName)
    {
        var username  = Context.User?.GetUsername() ?? throw new Exception("cannot get username");
        var group = await messageRepository.GetMessageGroup(groupName);
        var connection = new Connection{ConnectionId = Context.ConnectionId , UserName = username};


        if (group == null)
        {
            group = new Group { Name = groupName };
            messageRepository.AddGroup(group);
        }
        group.Connections.Add(connection);
        if( await messageRepository.SaveAllAsync()) return group;
        throw new HubException("failed to add to group");
    }

    private async Task<Group> RemoveFromMessageGroup()
    {
        var group = await messageRepository.GetGroupForConnection(Context.ConnectionId);
        var connection = group?.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
        if (connection != null && group != null)
        {
            messageRepository.RemoveConnection(connection);
            if (await messageRepository.SaveAllAsync())return group;

        }
        throw new Exception("failed to remove from group");
    }
    private string GetGroupName(string caller , string? other)
    {
        var stringCompareable = string.CompareOrdinal(caller, other)<0;
        return stringCompareable ? $"{caller}-{other}" : $"{other}-{caller}";
    }
}
