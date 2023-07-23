<template>
  <div v-if="!joined">
    <input type="text" placeholder="请输入用户名" v-model="username">
    <button @click="join">进入聊天室</button>
  </div>

  <div v-else>
    <p>欢迎你{{ username }}</p>
    <hr>
    <ul id="messages" ref="messages"></ul>
    <form id="form" @submit.prevent>
      <input id="input" autocomplete="off" v-model="msg" />
      <button @click="sendMsg">发送</button>
    </form>
  </div>
</template>

<script setup>
import { io } from "socket.io-client";
import { nextTick, onMounted, ref } from "vue";
const joined = ref(false); // 是否进入了聊天室
const username = ref(''); // 用户名
const msg = ref(''); // 输入框的文字
const messages = ref(null); // 绑定聊天记录的ul的dom实例
let socket;
// 点击进入聊天室
const join = () => {
  socket = io('http://localhost:3000', { // 连接socket
    query: {
      username: username.value
    }
  });
  socket.on('chat message', function (msg) { // 接收消息
    // 这里的msg其实是后端触发的chat message，传递过来的

    let item = document.createElement('li');
    item.textContent = msg;
    nextTick(() => {
      messages.value.appendChild(item);
    })
    window.scrollTo(0, document.body.scrollHeight); // 页面滚动到最底部
  });
  joined.value = true; // 进入聊天室
}
// 点击发送消息
const sendMsg = () => {
  if (msg.value) {
    socket.emit('chat message', msg.value);  // 发消息事件
    msg.value = '';
  }
}
</script>

<style>
body {
  margin: 0;
  padding-bottom: 3rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

#form {
  background: rgba(0, 0, 0, 0.15);
  padding: 0.25rem;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 3rem;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
}

#input {
  border: none;
  padding: 0 1rem;
  flex-grow: 1;
  border-radius: 2rem;
  margin: 0.25rem;
}

#input:focus {
  outline: none;
}

#form>button {
  background: #333;
  border: none;
  padding: 0 1rem;
  margin: 0.25rem;
  border-radius: 3px;
  outline: none;
  color: #fff;
}

#messages {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

#messages>li {
  padding: 0.5rem 1rem;
}

#messages>li:nth-child(odd) {
  background: #efefef;
}
</style>
