export type ContactTopic = "job" | "project" | "question";

export type ContactRequest = {
  topic?: ContactTopic;
  subject?: string;
};

const contactRequestEventName = "portfolio:contact-request";

// Lets any part of the experience (e.g. a project card) prefill the contact form
export function requestContact(contactRequest: ContactRequest) {
  window.dispatchEvent(
    new CustomEvent<ContactRequest>(contactRequestEventName, {
      detail: contactRequest,
    })
  );
}

export function onContactRequest(
  listener: (contactRequest: ContactRequest) => void
) {
  function handleContactRequest(e: Event) {
    listener((e as CustomEvent<ContactRequest>).detail);
  }

  window.addEventListener(contactRequestEventName, handleContactRequest);
  return () =>
    window.removeEventListener(contactRequestEventName, handleContactRequest);
}
