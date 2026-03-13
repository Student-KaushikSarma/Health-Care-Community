// ======================================================
//  Community Page — Post Feed with Text & Voice Input
// ======================================================
import { getCurrentUser, showToast } from '../../main.js';

// --- Data Helpers --------------------------------------------------------
function getPosts() {
  const raw = localStorage.getItem('healthhub_posts');
  if (raw) return JSON.parse(raw);
  // Seed with sample posts
  const seed = [
    {
      id: '1',
      author: 'Dr. Sarah Chen',
      authorId: 'seed1',
      content: 'Remember to get your annual health checkup! Prevention is always better than cure. I see too many patients who come in only when symptoms become severe. A simple yearly visit can catch so many issues early. 🩺',
      type: 'text',
      likes: 24,
      likedBy: [],
      comments: [
        { id: 'c1', author: 'Mike R.', text: 'So true! Just scheduled mine. Thanks for the reminder!' },
        { id: 'c2', author: 'Priya S.', text: 'What tests do you recommend for someone in their 30s?' }
      ],
      timestamp: Date.now() - 3600000 * 5
    },
    {
      id: '2',
      author: 'Community Health',
      authorId: 'seed2',
      content: 'Walking 30 minutes daily can reduce the risk of heart disease by up to 35%. Start small if you need to — even 10 minutes makes a difference! Who\'s joining the walking challenge this week? 🚶‍♂️❤️',
      type: 'text',
      likes: 42,
      likedBy: [],
      comments: [
        { id: 'c3', author: 'Lisa T.', text: 'I\'ve been doing this for 3 months and feel amazing!' }
      ],
      timestamp: Date.now() - 3600000 * 12
    },
    {
      id: '3',
      author: 'Alex Johnson',
      authorId: 'seed3',
      content: 'Just used the voice feature to share this! I wanted to talk about my experience with managing anxiety through breathing exercises. The 4-7-8 technique has been a game changer for me. You breathe in for 4 seconds, hold for 7, and exhale for 8. Try it!',
      type: 'voice',
      likes: 18,
      likedBy: [],
      comments: [],
      timestamp: Date.now() - 3600000 * 24
    },
    {
      id: '4',
      author: 'Nutrition Expert',
      authorId: 'seed4',
      content: 'Myth busted: Eating fat does NOT make you fat. Healthy fats from avocados, nuts, olive oil, and fish are essential for brain health, hormone production, and nutrient absorption. Stop fearing fats and start choosing the right ones! 🥑',
      type: 'text',
      likes: 56,
      likedBy: [],
      comments: [
        { id: 'c4', author: 'Jamie K.', text: 'This changed my whole approach to dieting. Thank you!' },
        { id: 'c5', author: 'Dr. Patel', text: 'Absolutely correct. Mediterranean diets are evidence-based.' }
      ],
      timestamp: Date.now() - 3600000 * 48
    }
  ];
  localStorage.setItem('healthhub_posts', JSON.stringify(seed));
  return seed;
}

function savePosts(posts) {
  localStorage.setItem('healthhub_posts', JSON.stringify(posts));
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// --- Render --------------------------------------------------------------
export function renderCommunity(container) {
  const user = getCurrentUser();
  const posts = getPosts();

  const userInitials = user
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  container.innerHTML = `
    <section class="community-page">
      <div class="container">
        <div class="community-header">
          <h1>Community Forum</h1>
          <p>Share your thoughts, ask questions, and support each other</p>
        </div>

        ${user ? `
        <!-- Post Creation -->
        <div class="post-create">
          <div class="post-create-header">
            <div class="post-avatar">${userInitials}</div>
            <span style="color: var(--clr-text-secondary); font-size: var(--fs-sm);">What's on your mind, ${user.name.split(' ')[0]}?</span>
          </div>
          <textarea class="post-textarea" id="post-input" placeholder="Share a health tip, ask a question, or share your experience..."></textarea>
          <p class="voice-status" id="voice-status">🔴 Listening... Speak now</p>
          <div class="post-actions">
            <div class="post-tools">
              <button class="tool-btn" id="voice-btn" title="Record voice input">
                🎤 Voice Input
              </button>
              <button class="tool-btn" id="emoji-btn" title="Add emoji">
                😊 Emoji
              </button>
            </div>
            <button class="btn btn-primary" id="post-submit-btn">Post</button>
          </div>
        </div>
        ` : `
        <div class="post-create" style="text-align:center; padding: var(--space-10);">
          <p style="color: var(--clr-text-secondary); margin-bottom: var(--space-4);">Sign in to share your thoughts with the community</p>
          <a href="#/login" class="btn btn-primary">Sign In to Post</a>
        </div>
        `}

        <!-- Post Feed -->
        <div class="post-feed" id="post-feed">
          ${renderPosts(posts, user)}
        </div>
      </div>
    </section>
  `;

  // --- Attach Event Listeners ---
  if (user) {
    setupPostCreation(container, user);
    setupVoiceInput(container);
  }
  setupPostInteractions(container, user);
}

// --- Render Posts --------------------------------------------------------
function renderPosts(posts, user) {
  if (posts.length === 0) {
    return `<div style="text-align:center; padding: var(--space-16); color: var(--clr-text-muted);">
      <p style="font-size: 3rem; margin-bottom: var(--space-4);">💬</p>
      <p>No posts yet. Be the first to share!</p>
    </div>`;
  }

  return posts.map(post => {
    const initials = post.author.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const isLiked = user && post.likedBy && post.likedBy.includes(user.id);

    return `
      <div class="post-card" data-post-id="${post.id}">
        <div class="post-card-header">
          <div class="post-avatar" style="width:38px;height:38px;min-width:38px;font-size:0.8rem;">${initials}</div>
          <div>
            <div class="post-author">${post.author}</div>
            <div class="post-time">${timeAgo(post.timestamp)}</div>
          </div>
          <span class="post-badge ${post.type}">${post.type === 'voice' ? '🎤 Voice' : '✏️ Text'}</span>
        </div>
        <div class="post-content">${escapeHtml(post.content)}</div>
        <div class="post-footer">
          <button class="post-action-btn like-btn ${isLiked ? 'liked' : ''}" data-post-id="${post.id}">
            ${isLiked ? '❤️' : '🤍'} <span>${post.likes}</span>
          </button>
          <button class="post-action-btn comment-toggle-btn" data-post-id="${post.id}">
            💬 <span>${post.comments.length}</span> Comments
          </button>
          <button class="post-action-btn share-btn" data-post-id="${post.id}">
            🔗 Share
          </button>
        </div>
        <div class="post-comments" id="comments-${post.id}">
          ${post.comments.map(c => {
            const cInit = c.author.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            return `
            <div class="comment-item">
              <div class="comment-avatar">${cInit}</div>
              <div class="comment-body">
                <div class="comment-author">${escapeHtml(c.author)}</div>
                <div class="comment-text">${escapeHtml(c.text)}</div>
              </div>
            </div>`;
          }).join('')}
          ${user ? `
          <div class="comment-input-row">
            <input class="comment-input" placeholder="Write a comment..." data-post-id="${post.id}" />
            <button class="btn btn-primary btn-sm comment-submit-btn" data-post-id="${post.id}">Send</button>
          </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// --- Post Creation -------------------------------------------------------
function setupPostCreation(container, user) {
  const input = container.querySelector('#post-input');
  const submitBtn = container.querySelector('#post-submit-btn');
  const emojiBtn = container.querySelector('#emoji-btn');

  submitBtn.addEventListener('click', () => {
    const content = input.value.trim();
    if (!content) {
      showToast('Please write something before posting');
      return;
    }

    const posts = getPosts();
    const isVoice = input.dataset.voiceInput === 'true';
    const newPost = {
      id: Date.now().toString(),
      author: user.name,
      authorId: user.id,
      content,
      type: isVoice ? 'voice' : 'text',
      likes: 0,
      likedBy: [],
      comments: [],
      timestamp: Date.now()
    };

    posts.unshift(newPost);
    savePosts(posts);
    input.value = '';
    input.dataset.voiceInput = 'false';

    // Re-render feed
    container.querySelector('#post-feed').innerHTML = renderPosts(posts, user);
    setupPostInteractions(container, user);
    showToast('Post shared successfully! 🎉');
  });

  // Simple emoji insertion
  const emojis = ['😊', '❤️', '🙏', '💪', '🏥', '💊', '🩺', '🧘', '🥗', '🏃', '😷', '🤝'];
  emojiBtn.addEventListener('click', () => {
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    input.value += randomEmoji;
    input.focus();
  });
}

// --- Voice Input (Web Speech API) ----------------------------------------
function setupVoiceInput(container) {
  const voiceBtn = container.querySelector('#voice-btn');
  const voiceStatus = container.querySelector('#voice-status');
  const input = container.querySelector('#post-input');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    voiceBtn.addEventListener('click', () => {
      showToast('Voice input is not supported in your browser. Try Chrome or Edge.');
    });
    return;
  }

  let recognition = null;
  let isRecording = false;

  voiceBtn.addEventListener('click', () => {
    if (isRecording) {
      // Stop recording
      recognition.stop();
      return;
    }

    // Start recording
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = input.value;

    recognition.onstart = () => {
      isRecording = true;
      voiceBtn.classList.add('recording');
      voiceBtn.innerHTML = '⏹️ Stop';
      voiceStatus.classList.add('visible');
      input.dataset.voiceInput = 'true';
    };

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      input.value = finalTranscript + interim;
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        showToast('Microphone access denied. Please allow microphone permissions.');
      } else {
        showToast('Voice input error. Please try again.');
      }
      stopRecording();
    };

    recognition.onend = () => {
      input.value = finalTranscript.trim();
      stopRecording();
    };

    recognition.start();

    function stopRecording() {
      isRecording = false;
      voiceBtn.classList.remove('recording');
      voiceBtn.innerHTML = '🎤 Voice Input';
      voiceStatus.classList.remove('visible');
    }
  });
}

// --- Post Interactions (Like, Comment, Share) ----------------------------
function setupPostInteractions(container, user) {
  // Like buttons
  container.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!user) { showToast('Sign in to like posts'); return; }

      const postId = btn.dataset.postId;
      const posts = getPosts();
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (!post.likedBy) post.likedBy = [];
      const idx = post.likedBy.indexOf(user.id);
      if (idx > -1) {
        post.likedBy.splice(idx, 1);
        post.likes--;
        btn.classList.remove('liked');
        btn.innerHTML = `🤍 <span>${post.likes}</span>`;
      } else {
        post.likedBy.push(user.id);
        post.likes++;
        btn.classList.add('liked');
        btn.innerHTML = `❤️ <span>${post.likes}</span>`;
      }
      savePosts(posts);
    });
  });

  // Comment toggle
  container.querySelectorAll('.comment-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const postId = btn.dataset.postId;
      const commentsEl = container.querySelector(`#comments-${postId}`);
      commentsEl.classList.toggle('visible');
    });
  });

  // Comment submit
  container.querySelectorAll('.comment-submit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!user) return;
      const postId = btn.dataset.postId;
      const inputEl = container.querySelector(`.comment-input[data-post-id="${postId}"]`);
      const text = inputEl.value.trim();
      if (!text) return;

      const posts = getPosts();
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      post.comments.push({
        id: Date.now().toString(),
        author: user.name,
        text
      });
      savePosts(posts);
      inputEl.value = '';

      // Re-render
      container.querySelector('#post-feed').innerHTML = renderPosts(posts, user);
      // Reopen the comment section
      const commentsEl = container.querySelector(`#comments-${postId}`);
      if (commentsEl) commentsEl.classList.add('visible');
      setupPostInteractions(container, user);
      showToast('Comment added! 💬');
    });
  });

  // Comment submit on enter
  container.querySelectorAll('.comment-input').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const postId = input.dataset.postId;
        container.querySelector(`.comment-submit-btn[data-post-id="${postId}"]`)?.click();
      }
    });
  });

  // Share buttons
  container.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({ title: 'HealthHub Post', url: window.location.href });
      } else {
        navigator.clipboard.writeText(window.location.href)
          .then(() => showToast('Link copied to clipboard! 📋'))
          .catch(() => showToast('Could not copy link'));
      }
    });
  });
}
