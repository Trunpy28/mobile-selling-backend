import crypto from 'crypto';

const vnpayConfig = {
    buildPaymentUrl: (params) => {
        const secretKey = process.env.VNPAY_SECRET_KEY;  // Lấy khóa bảo mật từ biến môi trường
        const tmnCode = process.env.VNPAY_TMN_CODE;  // Mã giao dịch của bạn

        // Tạo SecureHash cho các tham số thanh toán
        const secureHash = vnpayConfig.generateSecureHash(params, secretKey);

        // Thêm SecureHash vào các tham số
        params.vnp_SecureHash = secureHash;

        const baseUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';  // URL VNPay
        const query = new URLSearchParams(params).toString();

        return `${baseUrl}?${query}`;
    },

    generateSecureHash: (params, secretKey) => {
        // Sắp xếp các tham số theo thứ tự bảng chữ cái
        const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
        const hashString = sortedParams + `&vnp_SecureHashKey=${secretKey}`;

        return crypto.createHash('sha256').update(hashString).digest('hex').toUpperCase();
    },

    validateReturnUrl: (query) => {
        const secretKey = process.env.VNPAY_SECRET_KEY;
        const secureHash = query.vnp_SecureHash;
        delete query.vnp_SecureHash;

        const generatedHash = vnpayConfig.generateSecureHash(query, secretKey);

        return generatedHash === secureHash;  // Kiểm tra chữ ký từ VNPay có hợp lệ không
    }
};

export default vnpayConfig;
