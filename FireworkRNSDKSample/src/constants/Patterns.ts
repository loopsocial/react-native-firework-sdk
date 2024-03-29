export default {
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/gi,
  hexColor: /^(0x|#)(?:[0-9a-fA-F]{3,4}){1,2}$/gi,
  number: /^\d+$/gi,
  channelId: /^\S+$/gi,
  playlistId: /^\S+$/gi,
  playlistGroupId: /^\S+$/gi,
  contentId: /^\S+$/gi,
  float: /^(0(\.\d{0,1})?|1(\.0{0,1})?)$/gi,
};
