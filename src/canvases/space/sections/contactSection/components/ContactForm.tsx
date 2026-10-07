import SceneHtml from "@/canvases/components/SceneHtml";
import useAnimateObjectVisibility from "@/canvases/hooks/useAnimateObjectVisibility";
import ContactFormContent from "@/components/contact/ContactFormContent";
import { useScrollContext } from "@/contexts/ScrollContext";
import { useIsCompactScreen } from "@/hooks/useMediaQuery";
import { contactFormScrollProgress } from "@/lib/sections";

// Contact form anchored next to Neptune (small screens get a scrollable panel instead, see ContactPanel)
function ContactForm() {
  const { scrollProgress } = useScrollContext();
  const isCompactScreen = useIsCompactScreen();
  const isActive = scrollProgress === contactFormScrollProgress;

  // Hide text when the current section viewed is not appriopriate for it to appear
  const { register } = useAnimateObjectVisibility({
    visibleRange: [contactFormScrollProgress, contactFormScrollProgress],
  });

  if (isCompactScreen) return null;

  return (
    <SceneHtml
      className="select-none"
      position={[1890, 32.5, -220]}
      isActive={isActive}
    >
      <div ref={register} className="opacity-0">
        <ContactFormContent />
      </div>
    </SceneHtml>
  );
}

export default ContactForm;
