/**
 * FINPAL™ SalesPal™ Chat Widget
 * Version: 1.0.0
 * Embeddable AI lead qualification widget
 */
(function () {
  'use strict';

  const script = document.currentScript;
  const tenantId = script?.getAttribute('data-tenant-id') || '';
  const theme = script?.getAttribute('data-theme') || 'dark';
  const position = script?.getAttribute('data-position') || 'bottom-right';
  const primaryColor = script?.getAttribute('data-primary-color') || '#00D9FF';
  const greeting = script?.getAttribute('data-greeting') || 'Hi! How can I help you today? 👋';
  const agentName = script?.getAttribute('data-agent-name') || 'SalesPal™';
  const apiBase = 'https://api.finpal.online';

  if (!tenantId) {
    console.warn('[FINPAL™ Widget] Missing data-tenant-id attribute.');
    return;
  }

  // ── Styles ──────────────────────────────────────────────────────────────
  const styles = `
    #finpal-widget-btn {
      position: fixed;
      ${position.includes('right') ? 'right: 24px;' : 'left: 24px;'}
      bottom: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: ${primaryColor};
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0, 217, 255, 0.4);
      z-index: 99998;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
      font-size: 24px;
    }
    #finpal-widget-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 28px rgba(0, 217, 255, 0.6);
    }
    #finpal-widget-frame {
      position: fixed;
      ${position.includes('right') ? 'right: 24px;' : 'left: 24px;'}
      bottom: 92px;
      width: 360px;
      height: 520px;
      border-radius: 16px;
      border: 1px solid rgba(0, 217, 255, 0.2);
      background: ${theme === 'dark' ? '#0B0C10' : '#ffffff'};
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      z-index: 99999;
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    #finpal-widget-frame.open { display: flex; animation: slideUp 0.2s ease; }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .fw-header {
      background: linear-gradient(135deg, #0B0C10, #111318);
      border-bottom: 1px solid rgba(0, 217, 255, 0.15);
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .fw-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: ${primaryColor};
      display: flex; align-items: center; justify-content: center;
      font-size: 18px;
    }
    .fw-name { color: #CFD8E3; font-weight: 600; font-size: 14px; }
    .fw-status { color: ${primaryColor}; font-size: 11px; }
    .fw-close {
      margin-left: auto; background: none; border: none;
      color: #CFD8E3; cursor: pointer; font-size: 18px; padding: 4px;
    }
    .fw-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .fw-msg {
      max-width: 80%; padding: 10px 14px; border-radius: 12px;
      font-size: 13px; line-height: 1.5;
    }
    .fw-msg.bot {
      background: rgba(0, 217, 255, 0.08);
      border: 1px solid rgba(0, 217, 255, 0.15);
      color: #CFD8E3; align-self: flex-start; border-radius: 4px 12px 12px 12px;
    }
    .fw-msg.user {
      background: ${primaryColor};
      color: #0B0C10; align-self: flex-end; border-radius: 12px 4px 12px 12px;
      font-weight: 500;
    }
    .fw-input-row {
      padding: 12px; border-top: 1px solid rgba(0, 217, 255, 0.1);
      display: flex; gap: 8px;
    }
    .fw-input {
      flex: 1; background: rgba(255,255,255,0.05);
      border: 1px solid rgba(0, 217, 255, 0.2); border-radius: 8px;
      padding: 10px 12px; color: #CFD8E3; font-size: 13px; outline: none;
    }
    .fw-input::placeholder { color: rgba(207, 216, 227, 0.4); }
    .fw-send {
      background: ${primaryColor}; border: none; border-radius: 8px;
      width: 38px; height: 38px; cursor: pointer; font-size: 16px;
      display: flex; align-items: center; justify-content: center;
    }
    .fw-powered {
      text-align: center; font-size: 10px; color: rgba(207,216,227,0.3);
      padding: 6px; border-top: 1px solid rgba(255,255,255,0.04);
    }
  `;

  // ── DOM ──────────────────────────────────────────────────────────────────
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  const btn = document.createElement('button');
  btn.id = 'finpal-widget-btn';
  btn.innerHTML = '💬';
  btn.title = 'Chat with SalesPal™';
  document.body.appendChild(btn);

  const frame = document.createElement('div');
  frame.id = 'finpal-widget-frame';
  frame.innerHTML = `
    <div class="fw-header">
      <div class="fw-avatar">🤖</div>
      <div>
        <div class="fw-name">${agentName}</div>
        <div class="fw-status">● Online — reply in seconds</div>
      </div>
      <button class="fw-close" id="fw-close-btn">✕</button>
    </div>
    <div class="fw-messages" id="fw-messages"></div>
    <div class="fw-input-row">
      <input class="fw-input" id="fw-input" placeholder="Type a message..." autocomplete="off" />
      <button class="fw-send" id="fw-send-btn">➤</button>
    </div>
    <div class="fw-powered">Powered by FINPAL™ SalesPal™</div>
  `;
  document.body.appendChild(frame);

  // ── Logic ────────────────────────────────────────────────────────────────
  let sessionId = null;
  const messagesEl = document.getElementById('fw-messages');
  const inputEl = document.getElementById('fw-input');

  function addMsg(text, type) {
    const div = document.createElement('div');
    div.className = `fw-msg ${type}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function sendMessage(text) {
    addMsg(text, 'user');
    inputEl.value = '';
    try {
      const res = await fetch(`${apiBase}/api/widget/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, sessionId, message: text })
      });
      const data = await res.json();
      if (data.sessionId) sessionId = data.sessionId;
      addMsg(data.reply || 'Let me look into that...', 'bot');
    } catch {
      addMsg('Sorry, I had a connection issue. Try again in a moment!', 'bot');
    }
  }

  btn.addEventListener('click', () => {
    frame.classList.toggle('open');
    if (frame.classList.contains('open') && !messagesEl.children.length) {
      addMsg(greeting, 'bot');
    }
  });

  document.getElementById('fw-close-btn').addEventListener('click', () => {
    frame.classList.remove('open');
  });

  document.getElementById('fw-send-btn').addEventListener('click', () => {
    const text = inputEl.value.trim();
    if (text) sendMessage(text);
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = inputEl.value.trim();
      if (text) sendMessage(text);
    }
  });

  console.log('[FINPAL™ SalesPal™] Widget loaded for tenant:', tenantId);
})();
