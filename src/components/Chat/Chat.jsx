import React, { createRef } from 'react';
import ChatForm from './ChatForm/ChatForm';
import ChatMessage from './ChatMessage/ChatMessage';
import links from './utility/links';
import './chat.css'
import { nanoid } from 'nanoid';
import Icon, { Stack } from '@mdi/react';
import { mdiCloudDownload, mdiDotsCircle } from '@mdi/js';

export default class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.userId = null;
    this.userHash = null;
    this.interval = null;
    this.checkHistory = true;
    this.state = {
      messages: [],
      waiting: false,
    };

    this.messagesElement = createRef();
    this.requestAddMessage = this.requestAddMessage.bind(this);
  }

  setMyId() {
    let hasId = localStorage.getItem('userId');
    let hasHash = localStorage.getItem('userHash');
    if (!hasId || !hasHash) {
      hasId = nanoid();
      hasHash = nanoid();
      localStorage.setItem('userId', hasId);
      localStorage.setItem('userHash', hasHash);
    }
    this.userId = hasId;
    this.userHash = hasHash;
  }

  listScroll = () => {
    if (this.messagesElement.current.scrollTop <= (this.messagesElement.current.scrollHeight - this.messagesElement.current.getBoundingClientRect().height) + 5
        && this.messagesElement.current.scrollTop >= (this.messagesElement.current.scrollHeight - this.messagesElement.current.getBoundingClientRect().height) - 5) {
      this.setState({
        checkHistory: false
      })
    } else if (!this.state.checkHistory) {
      this.setState({
        checkHistory: true
      })
    }
  }

  scrollChat = () => {
    //this.messagesElement.current.lastElementChild?.scrollIntoView(); // Можно и так
    this.messagesElement.current.scrollTop =
        this.messagesElement.current.scrollHeight - this.messagesElement.current.getBoundingClientRect().height;
  }

  resetUser = () => {
    const hasId = nanoid();
    const hasHash = nanoid();
    localStorage.setItem('userId', hasId);
    localStorage.setItem('userHash', hasHash);
    this.userId = hasId;
    this.userHash = hasHash;
    this.requestMessages();
  }

  requestMessages = async () => {
    let id = 0;
    const countMessages = this.state.messages.length;
    if (countMessages) {
      id = this.state.messages[countMessages - 1].id;
    }

    const response = await fetch(`${links.messages}?from=${id}`);
    const result = await response.json();
    this.setState((prevState) => ({
      messages: [...prevState.messages, ...result],
      waiting: false,
    }));
  }

  // Добавление сообщения в чат
  requestAddMessage = async (content) => {
    await fetch(`${links.messages}`, {
      method: 'POST',
      body: JSON.stringify({
        userId: this.userId,
        userHash: this.userHash,
        content }),
    }).catch(error => {
      console.log(error);
    }).then(res => {
      if (res.status === 403) {
        alert('Ваш токен доступа не совпадает с пользователем, от лица которого Вы пытаетесь отправить сообщение. Сбросьте пользовательские данные для того, чтобы продолжить беседу.');
      }
    });

    await this.requestMessages().then(()=>{
      if (!this.state.checkHistory) {
        this.scrollChat();
      }
    });

    // сбросим интервал, обновляющий список сообщений, ведь мы уже их обновили
    await clearInterval(this.interval);
    await this.setInterval();
  }

  setInterval = () => {
    this.interval = setInterval(() => {
      this.requestMessages()
          .catch(error => {
            console.log(error)
          });
    }, 5000);
  }

  componentDidMount() {
    this.setMyId();
    this.setInterval();
  }

  componentDidUpdate = (prevProps, prevState) => {
    // Нас интересует конкретный state
    if (!prevState.checkHistory && !this.state.checkHistory) {
      this.scrollChat();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="chat">
        <ul className="chat__messages" onScroll={this.listScroll} ref={this.messagesElement}>

          {this.state.messages.map((message) =>
            <li className='chat__message-item' key={message.id}>
              <ChatMessage content={message.content} myMessage={message.userId === this.userId} />
            </li>
          )}
          {this.state.waiting && <div className="chat__messages-waiting">
            <Stack>
              <Icon className={'material-icons'} path={mdiDotsCircle} size={1} color={'#73f806'} spin />
              <Icon className={'material-icons'} path={mdiCloudDownload} size={0.5} color={'#4bacfc'} />
            </Stack>
          </div>}
        </ul>
        <ChatForm resetUser={this.resetUser} requestAddMessage={this.requestAddMessage} />
      </div>
    );
  }
}
