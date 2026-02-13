import { fetchAddressByZipCode } from '../../../utils/address';

interface ClientTabProps {
    invoiceData: InvoiceData;
    setInvoiceData: React.Dispatch<React.SetStateAction<InvoiceData>>;
}

const ClientTab: React.FC<ClientTabProps> = ({
    invoiceData,
    setInvoiceData
}) => {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="space-y-5 bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                    <label className="text-[10px] font-black text-slate-400 mb-2 block uppercase tracking-widest">宛先名（御中 / 様）</label>
                    <input className="w-full p-0 text-xl font-black border-none bg-white focus:ring-0" placeholder="株式会社〇〇 御中" value={invoiceData.client.name} onChange={e => setInvoiceData(d => ({ ...d, client: { ...d.client, name: e.target.value } }))} />
                </div>
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 relative">
                    <label className="text-[10px] font-black text-slate-400 mb-2 block uppercase tracking-widest">郵便番号</label>
                    <input
                        className="w-full p-0 text-sm font-black border-none bg-white focus:ring-0"
                        placeholder="100-0005"
                        value={invoiceData.client.zipCode}
                        onChange={e => setInvoiceData(d => ({ ...d, client: { ...d.client, zipCode: e.target.value } }))}
                        onBlur={async (e) => {
                            const val = e.target.value;
                            if (val.length >= 7) {
                                const addr = await fetchAddressByZipCode(val);
                                if (addr) {
                                    setInvoiceData(d => ({
                                        ...d,
                                        client: { ...d.client, address: addr.fullAddress }
                                    }));
                                }
                            }
                        }}
                    />
                    <div className="absolute top-5 right-5 text-[9px] text-slate-400 font-bold opacity-50">自動入力</div>
                </div>
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                    <label className="text-[10px] font-black text-slate-400 mb-2 block uppercase tracking-widest">住所</label>
                    <textarea className="w-full text-sm font-bold border-none h-24 resize-none p-0 bg-white focus:ring-0" placeholder="東京都千代田区丸の内1-1-1" value={invoiceData.client.address} onChange={e => setInvoiceData(d => ({ ...d, client: { ...d.client, address: e.target.value } }))} />
                </div>
            </div>
        </div>
    );
};

export default ClientTab;
