import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, FileText, Info, Megaphone, Check } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { t } from '../i18n/translations';

type ModalType = 'privacy' | 'terms' | 'about' | 'advertise' | null;

export const Footer: React.FC = () => {
  const { state } = useGame();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const isLightBlue = state.themeTone === 'light_blue';

  const isTr = state.language === 'tr';

  const modalContent = {
    privacy: {
      title: isTr ? 'Gizlilik Politikası' : 'Privacy Policy',
      icon: Shield,
      content: isTr ? (
        <div className="space-y-3 text-xs leading-relaxed text-[#c8aa6e]/90">
          <p>
            <strong>Son Güncelleme:</strong> 2026
          </p>
          <p>
            <strong>chestsimulator.com</strong> olarak gizliliğinize büyük önem veriyoruz. Bu web sitesi, League of Legends varlıklarına dayalı ücretsiz bir hayran simülasyonu ve tıklama oyunudur.
          </p>
          <div className="space-y-1.5 bg-[#010a13] p-3 border border-[#1e2328] rounded-xs text-[#f0e6d2]">
            <p className="font-semibold text-[#00c8c8]">1. Veri Toplama & Yerel Depolama</p>
            <p className="text-[11px] text-[#a09b8c]">
              Kişisel kimlik bilgilerinizi toplamıyor veya üçüncü şahıslara satmıyoruz. Oyun ilerlemesi, açılan kostümler, sandıklar, altınlar ve ayarlar tarayıcınızın yerel depolama alanında (LocalStorage) saklanır.
            </p>
          </div>
          <div className="space-y-1.5 bg-[#010a13] p-3 border border-[#1e2328] rounded-xs text-[#f0e6d2]">
            <p className="font-semibold text-[#00c8c8]">2. Üçüncü Taraf Hizmetleri ve Görseller</p>
            <p className="text-[11px] text-[#a09b8c]">
              Şampiyon görselleri, kostümler ve eşya ikonları doğrudan Riot Games resmi Data Dragon CDN altyapısından çekilir. Gerçek Riot Games hesabınıza ait hiçbir bilgi istenmez veya saklanmaz.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 text-xs leading-relaxed text-[#c8aa6e]/90">
          <p>
            <strong>Last Updated:</strong> 2026
          </p>
          <p>
            At <strong>chestsimulator.com</strong>, we prioritize your privacy. This website is a fan-made simulation and clicker game based on League of Legends assets.
          </p>
          <div className="space-y-1.5 bg-[#010a13] p-3 border border-[#1e2328] rounded-xs text-[#f0e6d2]">
            <p className="font-semibold text-[#00c8c8]">1. Data Collection & Local Storage</p>
            <p className="text-[11px] text-[#a09b8c]">
              We do not collect or sell your personal identifiable information. Game progress, unlocked skins, chests, gold, and custom settings are stored locally on your device via browser LocalStorage.
            </p>
          </div>
          <div className="space-y-1.5 bg-[#010a13] p-3 border border-[#1e2328] rounded-xs text-[#f0e6d2]">
            <p className="font-semibold text-[#00c8c8]">2. Third-Party Services & Assets</p>
            <p className="text-[11px] text-[#a09b8c]">
              Champion splash arts, skins, and item icons are fetched from official Riot Games Data Dragon CDN endpoints. No personal credentials from your actual Riot Games account are ever requested or stored.
            </p>
          </div>
        </div>
      ),
    },
    terms: {
      title: isTr ? 'Kullanım Koşulları' : 'Terms of Use',
      icon: FileText,
      content: isTr ? (
        <div className="space-y-3 text-xs leading-relaxed text-[#c8aa6e]/90">
          <p>
            <strong>chestsimulator.com</strong>&apos;a hoş geldiniz. Bu siteyi kullanarak aşağıdaki şartları kabul etmiş sayılırsınız:
          </p>
          <div className="space-y-1.5 bg-[#010a13] p-3 border border-[#1e2328] rounded-xs text-[#f0e6d2]">
            <p className="font-semibold text-[#00c8c8]">1. Yalnızca Simülasyon & Eğlence Amaçlıdır</p>
            <p className="text-[11px] text-[#a09b8c]">
              Bu simülatörde açılan tüm eşyalar, para birimleri (Altın, Prestij Puanı, Mor Cevher), kostümler ve ganimet sandıkları tamamen simülasyondur. Gerçek dünyada parasal karşılıkları yoktur ve resmi Riot Games veya LoL hesaplarına aktarılamaz.
            </p>
          </div>
          <div className="space-y-1.5 bg-[#010a13] p-3 border border-[#1e2328] rounded-xs text-[#f0e6d2]">
            <p className="font-semibold text-[#00c8c8]">2. Fikri Mülkiyet</p>
            <p className="text-[11px] text-[#a09b8c]">
              League of Legends ve ilgili tüm mülkler ve ticari markalar Riot Games, Inc.&apos;e aittir. Bu proje, Riot Games&apos;in &quot;Legal Jibber Jabber&quot; politikasına uygundur.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 text-xs leading-relaxed text-[#c8aa6e]/90">
          <p>
            Welcome to <strong>chestsimulator.com</strong>. By using this website, you acknowledge and agree to the following terms:
          </p>
          <div className="space-y-1.5 bg-[#010a13] p-3 border border-[#1e2328] rounded-xs text-[#f0e6d2]">
            <p className="font-semibold text-[#00c8c8]">1. Simulation & Entertainment Only</p>
            <p className="text-[11px] text-[#a09b8c]">
              All items, currencies (Gold, Prestige Points, Mythic Essence), skins, and loot chests unlocked within this game are purely simulated. They have zero real-world monetary value and cannot be transferred, claimed, or linked to your official Riot Games or League of Legends accounts.
            </p>
          </div>
          <div className="space-y-1.5 bg-[#010a13] p-3 border border-[#1e2328] rounded-xs text-[#f0e6d2]">
            <p className="font-semibold text-[#00c8c8]">2. Intellectual Property</p>
            <p className="text-[11px] text-[#a09b8c]">
              League of Legends and all related properties, assets, and trademarks are owned by Riot Games, Inc. This project complies with Riot Games&apos;s &quot;Legal Jibber Jabber&quot; policy.
            </p>
          </div>
        </div>
      ),
    },
    about: {
      title: isTr ? 'chestsimulator.com Hakkında' : 'About chestsimulator.com',
      icon: Info,
      content: isTr ? (
        <div className="space-y-3 text-xs leading-relaxed text-[#c8aa6e]/90">
          <p>
            <strong>ChestSimulator.com</strong>, League of Legends evrenine ilgi duyan oyuncular için geliştirilmiş ücretsiz bir araçtır.
          </p>
          <div className="bg-[#010a13] p-3 border border-[#1e2328] rounded-xs text-[#f0e6d2] space-y-2">
            <p className="text-[11px] text-[#a09b8c]">
              Amacımız, oyuncuların Hextech zanaatkarlık sistemindeki sandık açma oranlarını hiçbir harcama yapmadan deneyimlemelerini sağlamaktır. Projemiz tamamen fan yapımı olup, tüm hakları Riot Games&apos;e aittir.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-[#00c8c8] font-bold uppercase tracking-wider pt-1">
              <Check className="w-3.5 h-3.5" /> League of Legends Topluluğu İçin Geliştirildi
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 text-xs leading-relaxed text-[#c8aa6e]/90">
          <p>
            <strong>ChestSimulator.com</strong> is a free interactive utility designed for League of Legends enthusiasts.
          </p>
          <div className="bg-[#010a13] p-3 border border-[#1e2328] rounded-xs text-[#f0e6d2] space-y-2">
            <p className="text-[11px] text-[#a09b8c]">
              Our mission is to allow players to experience Hextech crafting chest opening drop rates risk-free without spending real money. All assets are owned by Riot Games.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-[#00c8c8] font-bold uppercase tracking-wider pt-1">
              <Check className="w-3.5 h-3.5" /> Built for the League of Legends Community
            </div>
          </div>
        </div>
      ),
    },
    advertise: {
      title: isTr ? 'Reklam & İletişim' : 'Advertise with chestsimulator.com',
      icon: Megaphone,
      content: isTr ? (
        <div className="space-y-3 text-xs leading-relaxed text-[#c8aa6e]/90">
          <p>
            <strong>chestsimulator.com</strong> ile iş birliği yapmak veya projenizi tanıtmak mı istiyorsunuz?
          </p>
          <div className="bg-[#010a13] p-3 border border-[#1e2328] rounded-xs text-[#f0e6d2] space-y-2">
            <p className="text-[11px] text-[#a09b8c]">
              Aktif League of Legends ve oyun topluluğuna ulaşın. Kullanıcı deneyimini bozmayan özel sponsorluk ve reklam alanları sunuyoruz.
            </p>
            <div className="p-2 bg-[#031526] border border-[#005a82]/40 rounded-xs text-[11px] text-[#f0e6d2] flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-[#c8aa6e] font-bold">İletişim & İş Birlikleri:</span>
              <span className="text-[#00c8c8] font-mono select-all">contact@chestsimulator.com</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 text-xs leading-relaxed text-[#c8aa6e]/90">
          <p>
            Interested in collaborating or promoting your gaming content, tournament, or community with <strong>chestsimulator.com</strong>?
          </p>
          <div className="bg-[#010a13] p-3 border border-[#1e2328] rounded-xs text-[#f0e6d2] space-y-2">
            <p className="text-[11px] text-[#a09b8c]">
              Reach engaged League of Legends and gaming fans. We offer customized sponsor placements and ad-banner opportunities that respect user experience.
            </p>
            <div className="p-2 bg-[#031526] border border-[#005a82]/40 rounded-xs text-[11px] text-[#f0e6d2] flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-[#c8aa6e] font-bold">Contact & Partnerships:</span>
              <span className="text-[#00c8c8] font-mono select-all">contact@chestsimulator.com</span>
            </div>
          </div>
        </div>
      ),
    },
  };

  const current = activeModal ? modalContent[activeModal] : null;

  return (
    <>
      <footer className={`w-full mt-auto border-t transition-colors duration-300 py-6 px-4 ${
        isLightBlue
          ? 'bg-[#020e1a]/95 border-[#005a82]/40 text-[#a09b8c]'
          : 'bg-[#010a13]/95 border-[#1e2328] text-[#a09b8c]'
      }`}>
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center space-y-3.5">
          
          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs font-semibold tracking-wide text-[#c8aa6e]">
            <a
              href="index.html"
              className="hover:text-[#00c8c8] transition-colors"
            >
              {t('footer.home', state.language)}
            </a>
            <span className="text-[#785a28] select-none font-bold">·</span>

            <a
              href="blog.html"
              className="hover:text-[#00c8c8] transition-colors"
            >
              {t('footer.blog', state.language)}
            </a>
            <span className="text-[#785a28] select-none font-bold">·</span>

            <a
              href="about.html"
              className="hover:text-[#00c8c8] transition-colors"
            >
              {t('footer.about', state.language)}
            </a>
            <span className="text-[#785a28] select-none font-bold">·</span>

            <a
              href="privacy.html"
              id="footer-link-privacy"
              className="hover:text-[#00c8c8] transition-colors"
            >
              {t('footer.privacy', state.language)}
            </a>
            <span className="text-[#785a28] select-none font-bold">·</span>
            
            <a
              href="terms.html"
              id="footer-link-terms"
              className="hover:text-[#00c8c8] transition-colors"
            >
              {t('footer.terms', state.language)}
            </a>
            <span className="text-[#785a28] select-none font-bold">·</span>

            <a
              href="cookie-policy.html"
              id="footer-link-cookie"
              className="hover:text-[#00c8c8] transition-colors"
            >
              {t('footer.cookie', state.language)}
            </a>
            <span className="text-[#785a28] select-none font-bold">·</span>

            <a
              href="contact.html"
              id="footer-link-contact"
              className="hover:text-[#00c8c8] transition-colors"
            >
              {t('footer.contact', state.language)}
            </a>
          </nav>

          {/* Legal Jibber Jabber Disclaimer */}
          <p className="text-[11px] sm:text-xs text-[#a09b8c] max-w-2xl leading-relaxed font-normal">
            {t('footer.disclaimer', state.language)}
          </p>

          {/* Copyright */}
          <p className="text-[11px] text-[#785a28] font-medium tracking-wide">
            {t('footer.copyright', state.language)}
          </p>
        </div>
      </footer>

      {/* Info Modal */}
      <AnimatePresence>
        {activeModal && current && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010a13]/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-[#0a1428] border border-[#c8aa6e] shadow-[0_0_30px_rgba(0,0,0,0.8)] text-[#f0e6d2] p-5 rounded-xs"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#1e2328] pb-3 mb-4">
                <div className="flex items-center gap-2 text-[#c8aa6e]">
                  <current.icon className="w-4 h-4 text-[#00c8c8]" />
                  <h3 className="font-bold uppercase tracking-wider text-sm font-['Cinzel',serif]">
                    {current.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="text-[#a09b8c] hover:text-[#f0e6d2] p-1 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="mb-4">
                {current.content}
              </div>

              {/* Footer Close */}
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-full py-2 bg-[#1e2328] hover:bg-[#c89b3c]/20 hover:border-[#c8aa6e] border border-[#1e2328] text-xs uppercase font-bold tracking-wider text-[#f0e6d2] transition-colors rounded-xs cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
