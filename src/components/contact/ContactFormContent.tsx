import emailjs from "@emailjs/browser";
import { useLingui } from "@lingui/react/macro";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  Github,
  Linkedin,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  CONTACT_EMAIL,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  getResumeLink,
  GITHUB_LINK,
  LINKEDIN_LINK,
} from "@/lib/constants";
import { type ContactTopic, onContactRequest } from "@/lib/contactRequest";
import { cn } from "@/lib/utils";

const contactTopics: ContactTopic[] = ["job", "project", "question"];
// Pragmatic check, the real validation is that the reply arrives
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactFormValues = {
  topic: ContactTopic;
  subject: string;
  message: string;
  email: string;
  // Honeypot field that only bots fill in
  contactFaxNumber: string;
};

/**
 * Contact form with its title and the other ways to get in touch. Rendered in the 3D scene on big screens, in a scrollable panel on small ones
 */
function ContactFormContent({ className }: { className?: string }) {
  const { t } = useLingui();
  const { language } = useLanguage();
  const topicGroupId = useId();

  const topicLabels: Record<ContactTopic, string> = {
    job: t`A job`,
    project: t`A project`,
    question: t`A question`,
  };

  // Form state
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [sentToEmail, setSentToEmail] = useState<string | null>(null);
  const [hasCopiedEmail, setHasCopiedEmail] = useState(false);
  const form = useForm<ContactFormValues>({
    defaultValues: {
      topic: "job",
      subject: "",
      message: "",
      email: "",
      contactFaxNumber: "",
    },
  });
  const subject = form.watch("subject");

  // Other parts of the experience can prefill the form (e.g. asking for a project walkthrough)
  useEffect(
    () =>
      onContactRequest(({ topic, subject }) => {
        setSentToEmail(null);
        if (topic) form.setValue("topic", topic);
        form.setValue("subject", subject ?? "");
      }),
    [form]
  );

  // Handle send email service
  async function onSubmit(formValues: ContactFormValues) {
    const values = {
      ...formValues,
      message: formValues.message.trim(),
      email: formValues.email.trim(),
    };

    // Bots fill in the hidden field, pretend everything went fine
    if (values.contactFaxNumber) {
      setSentToEmail(values.email);
      return;
    }

    setIsSendingEmail(true);
    const toastLoadingId = toast.loading(t`Sending...`);
    const topicLabel = topicLabels[values.topic];
    const emailSubject = values.subject
      ? `${topicLabel}: ${values.subject}`
      : `${topicLabel} (3D space portfolio)`;

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          subject: emailSubject,
          // The reply address is part of the message too, so it's never lost whatever the email template contains
          message: `${values.message}\n\n—\nReply to: ${values.email}\nTopic: ${topicLabel}\nLanguage: ${language}`,
          email: values.email,
          reply_to: values.email,
          from_email: values.email,
          topic: topicLabel,
        },
        {
          publicKey: EMAILJS_PUBLIC_KEY,
        }
      );

      toast.dismiss(toastLoadingId);
      toast.success(t`Sent. Thank you!`);
      setSentToEmail(values.email);
      form.reset({ ...form.getValues(), subject: "", message: "" });
    } catch {
      toast.dismiss(toastLoadingId);
      toast.error(
        t`Something went wrong with sending the message. Please email me directly at ${CONTACT_EMAIL}`,
        { duration: 10000 }
      );
    } finally {
      setIsSendingEmail(false);
    }
  }

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setHasCopiedEmail(true);
      toast.success(t`Email copied`);
      setTimeout(() => setHasCopiedEmail(false), 2500);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  }

  return (
    <div className={cn("flex flex-col gap-5 short:gap-3 w-[27.5rem] max-w-full", className)}>
        {/* Title */}
        <div className="flex flex-col gap-2">
          <h2 className="w-max max-w-full text-blue-gradient text-7xl short:text-4xl max-sm:text-5xl font-bold pb-1">
            {t`Contact`}
          </h2>
          <p className="text-foreground/85 text-lg short:text-sm">
            {t`A role, a project or a question? One message is enough, I usually reply within a day.`}
          </p>
        </div>

        {sentToEmail ? (
          /* Success state */
          <div
            role="status"
            className="flex flex-col gap-3 rounded-xl border border-[#3f5fff]/50 bg-background/60 backdrop-blur-sm p-6"
          >
            <p className="text-2xl font-bold">
              {t`Sent. Thank you!`}{" "}
              <span className="font-emoji" aria-hidden>
                🚀
              </span>
            </p>
            <p className="text-foreground/80">
              {t`I'll reply to ${sentToEmail}.`}
            </p>
            <Button
              variant="outline"
              className="self-start"
              onClick={() => setSentToEmail(null)}
            >
              {t`Write another message`}
            </Button>
          </div>
        ) : (
          /* Form */
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5 short:gap-3 select-text"
              noValidate
            >
              {/* Topic */}
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <fieldset className="flex flex-col gap-2">
                    <legend
                      id={topicGroupId}
                      className="text-sm font-medium pb-2"
                    >
                      {t`What is it about?`}
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {contactTopics.map((topic) => (
                        <label
                          key={topic}
                          className={cn(
                            "cursor-pointer rounded-full border px-4 py-1.5 text-sm transition-colors has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-[#3f5fff]/50",
                            field.value === topic
                              ? "border-[#3f5fff] bg-[#273de6]/70 text-foreground"
                              : "border-input bg-background/40 text-foreground/80 hover:bg-foreground/10"
                          )}
                        >
                          <input
                            type="radio"
                            name={field.name}
                            value={topic}
                            checked={field.value === topic}
                            onChange={() => field.onChange(topic)}
                            disabled={isSendingEmail}
                            className="sr-only"
                          />
                          {topicLabels[topic]}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}
              />

              {/* Prefilled subject (e.g. a project walkthrough) */}
              {subject && (
                <p className="text-sm text-foreground/80 -mt-2">
                  {t`Subject:`} <strong>{subject}</strong>
                </p>
              )}

              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                disabled={isSendingEmail}
                rules={{
                  validate: (value) => {
                    const length = value.trim().length;
                    if (length < 3)
                      return t`Message must be at least 3 characters long.`;
                    if (length > 2048)
                      return t`Message must be at max 2048 characters long.`;
                    return true;
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t`Your message`}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t`Hi Mateusz, we're looking for...`}
                        data-scroll-area
                        className="focus-visible:ring-[#1f2cdd] focus-visible:border-[#3f5fff] bg-background/50 resize-none overflow-y-auto h-40 short:h-24 field-sizing-fixed"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                disabled={isSendingEmail}
                rules={{
                  validate: (value) => {
                    const email = value.trim();
                    if (!email) return t`Please enter your email, so I can reply.`;
                    if (!emailPattern.test(email))
                      return t`This email doesn't look right.`;
                    return true;
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t`Where do I reply?`}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder={t`you@company.com`}
                        className="focus-visible:ring-[#1f2cdd] focus-visible:border-[#3f5fff] bg-background/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Honeypot */}
              <div className="sr-only" aria-hidden>
                <label>
                  Leave this field empty
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...form.register("contactFaxNumber")}
                  />
                </label>
              </div>

              {/* Submit */}
              <Button
                className="w-full h-11 text-base bg-[#273de6] focus-visible:ring-[#3f5fff] hover:bg-[#1c30c4] text-foreground"
                type="submit"
                disabled={isSendingEmail}
              >
                {isSendingEmail ? t`Sending...` : t`Send message`}
              </Button>
              <p className="text-xs text-muted-foreground -mt-2">
                {t`Your email is used only to reply to you.`}
              </p>
            </form>
          </Form>
        )}

        {/* Other ways to reach me */}
        <div className="flex flex-col gap-2 border-t border-foreground/15 pt-4">
          <p className="text-sm text-muted-foreground">{t`Prefer something else?`}</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyEmail}
              className="bg-background/40!"
            >
              {hasCopiedEmail ? (
                <CheckIcon aria-hidden />
              ) : (
                <CopyIcon aria-hidden />
              )}
              {CONTACT_EMAIL}
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="bg-background/40!"
            >
              <a
                href={LINKEDIN_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin aria-hidden />
                LinkedIn
                <span className="sr-only">{t`(opens in a new tab)`}</span>
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="bg-background/40!"
            >
              <a href={GITHUB_LINK} target="_blank" rel="noopener noreferrer">
                <Github aria-hidden />
                GitHub
                <span className="sr-only">{t`(opens in a new tab)`}</span>
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="bg-background/40!"
            >
              <a href={getResumeLink(language)} target="_blank" rel="noopener" download>
                <DownloadIcon aria-hidden />
                {t`CV (PDF)`}
              </a>
            </Button>
          </div>
        </div>
    </div>
  );
}

export default ContactFormContent;
