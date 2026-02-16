import React from 'react';
import { Layout } from '../../components/Layout';
import { SEO } from '../../components/SEO';

export const PrivacyPolicy: React.FC = () => {
    return (
        <Layout>
            <SEO title="プライバシーポリシー" description="Seikyu AIのプライバシーポリシー（個人情報保護方針）について。" />
            <div className="w-full max-w-4xl mx-auto px-6 py-24">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white/60 p-8 md:p-12">
                    <h1 className="text-3xl font-black text-slate-900 mb-8 border-b border-slate-200 pb-4">プライバシーポリシー</h1>

                    <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800">
                        <p>
                            Seikyu AI（以下、「当サービス」と言います。）におけるユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」と言います。）を定めます。
                        </p>

                        <h3>第1条（個人情報）</h3>
                        <p>
                            「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。
                        </p>

                        <h3>第2条（収集する情報の範囲）</h3>
                        <p>
                            当サービスは、ユーザーが入力した請求書データ（会社名、住所、振込先など）をブラウザのローカルストレージ（localStorage）にのみ保存します。これらのデータはユーザーの端末内に留まり、開発者のサーバー等へ送信・保存されることは一切ありません。
                        </p>

                        <h3>第3条（Cookieの使用について）</h3>
                        <p>
                            当サイトでは、広告配信やアクセス解析のためにCookie（クッキー）を使用しています。Cookieによりブラウザを識別していますが、特定の個人の識別はできない状態で匿名性が保たれています。<br />
                            Cookieの使用を望まない場合、ブラウザの設定でCookieを無効にすることができます。
                        </p>

                        <h3>第4条（広告配信について）</h3>
                        <p>
                            当サイトでは、第三者配信の広告サービス（Google AdSense）を利用しています。<br />
                            このような広告配信事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、当サイトや他サイトへのアクセスに関する情報 『Cookie』(氏名、住所、メール アドレス、電話番号は含まれません) を使用することがあります。<br />
                            Google AdSenseに関して、このプロセスの詳細やこのような情報が広告配信事業者に使用されないようにする方法については、<a href="https://policies.google.com/technologies/ads?hl=ja" target="_blank" rel="noopener noreferrer">Googleのポリシーと規約</a>をご覧ください。
                        </p>

                        <h3>第5条（アクセス解析ツールについて）</h3>
                        <p>
                            当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。<br />
                            このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。<br />
                            この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。
                        </p>

                        <h3>第6条（免責事項）</h3>
                        <p>
                            当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。<br />
                            当サイトのコンテンツ・情報につきまして、可能な限り正確な情報を掲載するよう努めておりますが、誤情報が入り込んだり、情報が古くなっていることもございます。<br />
                            当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
                        </p>

                        <h3>第7条（お問い合わせ）</h3>
                        <p>
                            本ポリシーに関するお問い合わせは、お問い合わせページよりお願いいたします。
                        </p>

                        <p className="text-right text-sm text-slate-500 mt-8">
                            2024年2月15日 制定
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
