import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="bg-indigo-800 p-4 text-white flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShieldCheck size={20} />
            プライバシーポリシー
          </h2>
          <button onClick={onClose} className="text-indigo-200 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto text-sm text-slate-700 leading-relaxed space-y-6">
          <section>
            <h3 className="font-bold text-slate-900 mb-2 text-base border-b pb-1">1. 広告の配信について</h3>
            <p>
              当サイトでは、第三者配信の広告サービス「Google アドセンス」を利用しています。
              広告配信事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、当サイトや他サイトへのアクセスに関する情報 「Cookie」(氏名、住所、メール アドレス、電話番号は含まれません) を使用することがあります。
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2 text-base border-b pb-1">2. Cookie（クッキー）の管理について</h3>
            <p>
              ユーザーは、ブラウザの設定によりCookieを無効にすることができます。Cookieを無効にする設定およびGoogleアドセンスに関する詳細は「広告 – ポリシーと規約 – Google」をご覧ください。
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2 text-base border-b pb-1">3. 免責事項</h3>
            <p>
              当サイトのコンテンツ・情報について、できる限り正確な情報を提供するよう努めておりますが、正確性や安全性を保証するものではありません。情報が古くなっていることもございます。
              当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2 text-base border-b pb-1">4. アクセス解析ツールについて</h3>
            <p>
              当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="bg-indigo-800 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};