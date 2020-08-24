const list = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');
const form = document.querySelector('#new-post form');
const fetchButton = document.querySelector('#available-posts button');
const posts = document.querySelector('ul');

const postsEndpoint = 'https://jsonplaceholder.typicode.com/posts';

// Deprecated
function sendHttpRequest(method, url, data) {
  /*const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';

    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject(new Error('Something went wrong...'));
      }
    };

    xhr.onerror = function() {
      reject(new Error('Failed to send request.'));
    };

    xhr.send(JSON.stringify(data));
  });

  return promise;*/

  return fetch(url, {
    method: method,
    body: data,
    //body: JSON.stringify(data),
    /*headers: {
      'Content-Type': 'application/json'
    }*/
  }).then(response => {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    } else {
      return response.json().then(error => {
        throw new Error('Something went wrong on the server side.');
      });
    }
  }).catch(error => {
    console.log(error);
    throw new Error('Something went wrong...');
  });
}

async function fetchPosts() {
  try {
    const response = await axios.get(postsEndpoint);
    const posts = response.data;
    
    for (const post of posts) {
      const postElement = document.importNode(postTemplate.content, true);

      postElement.querySelector('h2').textContent = post.title.toUpperCase();
      postElement.querySelector('p').textContent = post.body;
      postElement.querySelector('li').id = post.id;

      list.appendChild(postElement);
    }
  } catch(error) {
    alert(error.message);
    console.log(error.response);
  }
}

async function createPost(title, content) {
  const userId = Math.random();
  const post = {
    user_id: userId,
    title: title,
    body: content
  };

  const fd = new FormData(form);

  /*fd.append('title', title);
  fd.append('body', content);*/
  fd.append('user_id', userId);

  axios.post(postsEndpoint, fd);
}

fetchButton.addEventListener('click', fetchPosts);

form.addEventListener('submit', event => {
  event.preventDefault();

  const title = event.currentTarget.querySelector('#title').value;
  const content = event.currentTarget.querySelector('#content').value;

  createPost(title, content).then(() => {
    list.innerHTML = '';

    fetchPosts();
  });
});

posts.addEventListener('click', event => {
  if (event.target.tagName === 'BUTTON') {
    const postId = event.target.closest('li').id;
    
    axios.delete(`${postsEndpoint}/${postId}`);
  }
});