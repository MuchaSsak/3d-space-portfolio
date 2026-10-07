import JupiterModel from "@/canvases/space/jupiter/components/JupiterModel";
import CertificatesTitle from "@/canvases/space/sections/certificatesSection/components/CertificatesTitle";

// The list itself is a regular DOM overlay (see CertificatesPanel), so it scrolls natively
function CertificatesSection() {
  return (
    <>
      <JupiterModel />

      <CertificatesTitle />
    </>
  );
}

export default CertificatesSection;
