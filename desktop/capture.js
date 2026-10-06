const signedOut = document.getElementById('signed-out');
const signedIn = document.getElementById('signed-in');
const signInButton = document.getElementById('sign-in');
const signInStatus = document.getElementById('sign-in-status');
const titleInput = document.getElementById('title');
const saveButton = document.getElementById('save');
const saveStatus = document.getElementById('save-status');
const contextLine = document.getElementById('context');
const form = document.getElementById('task-form');

let signedInNow = false;

const setStatus = (node, message, isError) => {
  node.textContent = message || '';
  node.classList.toggle('error', Boolean(isError));
};

const render = (state) => {
  signedInNow = Boolean(state?.signedIn);
  signedOut.hidden = signedInNow;
  signedIn.hidden = !signedInNow;
  contextLine.textContent = state?.context?.label || 'Saved to your taskboard for today.';

  if (signedInNow) {
    titleInput.focus();
    titleInput.select();
  }
};

const showError = (error) => error?.message || 'Something went wrong. Try again.';

window.capture.onSession((state) => {
  setStatus(saveStatus, '');
  if (state?.reset) titleInput.value = '';
  render(state);
});

document.getElementById('close').addEventListener('click', () => {
  window.capture.hide();
});

signInButton.addEventListener('click', async () => {
  signInButton.disabled = true;
  setStatus(signInStatus, 'Waiting for Google in your browser…');
  try {
    const state = await window.capture.signIn();
    setStatus(signInStatus, '');
    titleInput.value = '';
    render(state);
  } catch (error) {
    setStatus(signInStatus, showError(error), true);
  } finally {
    signInButton.disabled = false;
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) {
    setStatus(saveStatus, 'Write the task first.', true);
    titleInput.focus();
    return;
  }

  saveButton.disabled = true;
  setStatus(saveStatus, 'Saving…');
  try {
    const result = await window.capture.saveTask(title);
    if (!result?.ok) {
      setStatus(saveStatus, result?.message || 'Could not save the task.', true);
      if (result?.signedOut) render({ signedIn: false });
      return;
    }
    setStatus(saveStatus, result.message || 'Saved.');
    titleInput.value = '';
    window.setTimeout(() => window.capture.hide(), 500);
  } catch (error) {
    setStatus(saveStatus, showError(error), true);
  } finally {
    saveButton.disabled = false;
  }
});

document.getElementById('open-noteboard').addEventListener('click', () => {
  window.capture.openBoard('noteboard');
});

document.getElementById('open-taskboard').addEventListener('click', () => {
  window.capture.openBoard('taskboard');
});

document.getElementById('sign-out').addEventListener('click', async () => {
  const state = await window.capture.signOut();
  titleInput.value = '';
  setStatus(saveStatus, '');
  render(state);
});

window.capture.getState().then(render).catch((error) => {
  setStatus(signInStatus, showError(error), true);
});
