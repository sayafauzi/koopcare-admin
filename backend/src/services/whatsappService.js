import axios from 'axios';

const WHATSAPP_API_URL = 'https://api.fonnte.com/send';
const API_KEY = process.env.WHATSAPP_API_KEY;

export async function sendOTP(phoneNumber, otp) {
    if (!API_KEY) {
        console.error('[WhatsApp] API key tidak dikonfigurasi');
        return false;
    }
    // Format nomor: hapus '+' jika ada
    const target = phoneNumber.replace(/^\+/, '');
    const message = `Kode verifikasi KoopCare Anda adalah: ${otp}\n\nKode ini berlaku 10 menit. Jangan berikan ke siapa pun.`;

    try {
        const response = await axios.post(WHATSAPP_API_URL, {
            target,
            message,
            delay: '2',
            countryCode: '62'
        }, {
            headers: { 'Authorization': API_KEY }
        });
        console.log(`[WhatsApp] OTP terkirim ke ${phoneNumber}:`, response.data);
        return true;
    } catch (error) {
        console.error('[WhatsApp] Gagal mengirim:', error.response?.data || error.message);
        return false;
    }
}