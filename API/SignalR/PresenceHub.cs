using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;
[Authorize]
public class PresenceHub(PresenceTracker tracker) :Hub
{
    public override async Task OnConnectedAsync()
    {
        if(Context.User ==null) throw new HubException("cannot get Current user claims");
        var isOnline = await tracker.UserConnected(Context.User.GetUsername() , Context.ConnectionId);
        if(isOnline) await Clients.Others.SendAsync("UserIsOnline" , Context.User?.GetUsername());

        var connectedUsers = await tracker.GetOnlineUsers();
        await Clients.Caller.SendAsync("OnlineUsers" , connectedUsers);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if(Context.User ==null) throw new HubException("cannot get Current user claims");

        var isOffline = await tracker.UserDisconnected(Context.User.GetUsername() , Context.ConnectionId);
        if(isOffline)await Clients.Others.SendAsync("UserIsOffline" , Context.User?.GetUsername());
        
        await base.OnDisconnectedAsync(exception);
    }
}
