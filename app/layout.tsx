import type {Metadata} from "next";
import "./globals.css";
import SiteHeader from "./components/site-header";
import SiteFooter from "./components/site-footer";
import WhatsAppFloat from "./components/whatsapp-float";
import SiteEffects from "./components/site-effects";
import CustomQuickForm from "./components/custom-quick-form";
export const metadata:Metadata={metadataBase:new URL("https://ranisa-boutique-store.shubhamnarang1601.chatgpt.site"),title:{default:"Ranisa Boutique | Elegance, Tailored for You",template:"%s | Ranisa Boutique"},description:"Discover traditional suits, festive lehengas and thoughtful custom designs at Ranisa Boutique, Dehradun. Indian heritage, your own expression."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><div className="site-backdrop" aria-hidden="true"><img src="/media/campaign-1600.webp" alt="" /></div><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader/><div id="main-content">{children}</div><SiteFooter/><WhatsAppFloat/><CustomQuickForm/><SiteEffects/></body></html>}
