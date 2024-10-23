import './chat-message.css'
import PropTypes from 'prop-types';

function ChatMessage({ content, myMessage }) {
  const myMessageClass = myMessage ? 'chat__message-my-message' : '';

  return (
    <div className={`chat__message ${myMessageClass}`}>
      <div className={'chat__body'}>
        <p className={'chat__text'}>{content}</p>
      </div>
    </div>
  )
}

ChatMessage.propTypes = {
  content: PropTypes.string.isRequired,
  myMessage: PropTypes.bool.isRequired,
};

// Скоро не будет работать, но для истории - оставим
// ChatMessage.defaultProps = {
//   myMessage: false,
//   content: null,
// }

export default ChatMessage;