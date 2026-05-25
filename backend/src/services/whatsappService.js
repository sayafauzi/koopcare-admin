import axios from 'axios';

const WHATSAPP_API_URL = 'https://api.fonnte.com/send';
const API_KEY = process.env.WHATSAPP_API_KEY;

const USE_DUMMY_OTP = process.env.USE_DUMMY_OTP === 'true';
const DUMMY_OTP_CODE = process.env.DUMMY_OTP_CODE || '587035';

export async function sendOTP(phoneNumber, otp) {
    // --- Mode DUMMY (untuk development) ---
    if (USE_DUMMY_OTP) {
        console.log(`[OTP] Mode DUMMY aktif. Kode OTP untuk ${phoneNumber}: ${DUMMY_OTP_CODE}`);
        return true;
    }

    // --- Mode NYATA (Fonnte) untuk production ---
    if (!API_KEY) {
        console.error('[WhatsApp] Mode nyata dipilih, tetapi API key tidak ditemukan.');
        throw new Error('WhatsApp API key tidak dikonfigurasi');
    }

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

// export async function sendOTP(phoneNumber, otp) {
//     if (!API_KEY) {
//         console.error('[WhatsApp] API key tidak dikonfigurasi');
//         return false;
//     }
//     // Format nomor: hapus '+' jika ada
//     const target = phoneNumber.replace(/^\+/, '');
//     const message = `Kode verifikasi KoopCare Anda adalah: ${otp}\n\nKode ini berlaku 10 menit. Jangan berikan ke siapa pun.`;

//     try {
//         const response = await axios.post(WHATSAPP_API_URL, {
//             target,
//             message,
//             delay: '2',
//             countryCode: '62'
//         }, {
//             headers: { 'Authorization': API_KEY }
//         });
//         console.log(`[WhatsApp] OTP terkirim ke ${phoneNumber}:`, response.data);
//         return true;
//     } catch (error) {
//         console.error('[WhatsApp] Gagal mengirim:', error.response?.data || error.message);
//         return false;
//     }
// }