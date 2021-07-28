import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';


@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {
  message = '';
  messages = [];
  currentUser = '';

  constructor(private socket: Socket, private toastController: ToastController) { }

ngOnInit(){
  this.socket.connect();

  let name = `Usuario-${new Date().getTime()}`;
  this.currentUser = name;

  this.socket.emit('set-name', name);

  this.socket.fromEvent('users-changed').subscribe(data => {
    console.log('got data: ', data);
    let user = data['user'];
    if(data['event'] == 'left'){
      this.showToast(`${user}, saiu do chat`);
     } else {
      this.showToast(`${user}, entrou no chat`);
     }
  });

  this.socket.fromEvent('message').subscribe(message => {
    console.log('New: ', message);
    this.messages.push(message);
  });
}

    sendMessage(){
      this.socket.emit('send-message', {text:this.message});
      this.message = '';
    }

    ionViewWillLeave(){
      this.socket.disconnect();
    }


    async showToast(msg){
        let toast = await this.toastController.create({
          message: msg,
          duration:3000,
          position:'top'
        });
        toast.present();
      }

}
