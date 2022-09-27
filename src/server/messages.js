const messages = [];

const addMessage = (data) => {
 messages.push(data);

 return data;
};

const getChannelMessages = (channel) =>
 messages.filter((message) => message.channel === channel);

module.exports = { addMessage, getChannelMessages };