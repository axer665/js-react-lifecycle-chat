import { useState } from 'react';
import './chat-form.css'
import Icon from '@mdi/react';
import { mdiNavigation, mdiReload } from '@mdi/js';
import PropTypes from 'prop-types';

function ChatForm({ resetUser, requestAddMessage }) {
  const [message, setMessage] = useState('')

  const handleChange = (event) => {
    const { value } = event.target;
    setMessage(value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (message.length === 0) return;

    requestAddMessage(message);
    setMessage('');
  }

  return (
      <form className={'chat__form form-message'} onSubmit={handleSubmit}>
          <button type={'button'} className={'form-message__btn form-message__btn-reload'} onClick={()=>{resetUser()}}>
              <Icon className={'material-icons'} path={mdiReload} size={1} color={'#ff0000'}/>
          </button>
          <textarea
              className={'form-message__input'}
              name={'message'}
              value={message}
              onChange={handleChange}
              rows={'3'}>
          </textarea>
          <button type={'submit'} className={'form-message__btn form-message__btn-send'}>
              <Icon className={'material-icons'} path={mdiNavigation} size={1} color={'#00C853'} rotate={90}/>
          </button>
      </form>
  )
}

ChatForm.propTypes = {
    requestAddMessage: PropTypes.func.isRequired,
    resetUser: PropTypes.func.isRequired
};

export default ChatForm;