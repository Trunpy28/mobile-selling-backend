import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Import thêm để xử lý URL
import { log } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
});

export const sendCreateOrderEmail = async (order, email) => {
  // Đọc file HTML từ template
  const sourceHtml = fs.readFileSync(path.resolve(__dirname, "../templateEmails/createOrder.html"), { encoding: "utf8" });

  const template = handlebars.compile(sourceHtml); // Compile template Handlebars

  const orderData = order.toObject();

  // Xử lý dữ liệu định dạng ngày giờ và tiền tệ
  orderData.createdAtFormatted = new Date(order.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  orderData.subTotalFormatted = order.subTotal.toLocaleString("vi-VN");
  orderData.shippingPriceFormatted = order.shippingPrice.toLocaleString("vi-VN");
  orderData.totalPriceFormatted = order.totalPrice.toLocaleString("vi-VN");

  // Định dạng giá cho từng sản phẩm
  orderData.products = orderData.products.map(product => ({
    ...product,
    priceFormatted: product.price.toLocaleString("vi-VN"),
    totalPriceFormatted: (product.price * product.quantity).toLocaleString("vi-VN"),
  }));
  
  const context = { order: orderData };

  const createOrderHtml = template(context); // Tạo HTML email

  const mailOptions = {
    from: process.env.MAIL_ACCOUNT, // Địa chỉ email người gửi
    to: email, // Địa chỉ email người nhận
    subject: "Xác nhận đặt hàng", // Tiêu đề email
    text: "Đặt hàng thành công!", // Nội dung văn bản
    html: createOrderHtml, // Nội dung HTML
  };

  // Gửi email
  await transporter.sendMail(mailOptions);
};
