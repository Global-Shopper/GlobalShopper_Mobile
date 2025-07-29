# 🌍 Global Shopper - GShop

**GShop** là một nền tảng hỗ trợ **mua hộ hàng quốc tế**, cho phép người dùng dễ dàng gửi yêu cầu mua hàng từ các trang thương mại điện tử hoặc cửa hàng ở nước ngoài, theo dõi tiến trình đơn hàng, quản lý ví tiền và thực hiện hoàn tiền một cách tiện lợi.

---

## 🚀 Công nghệ sử dụng

-   **React Native** – phát triển ứng dụng di động đa nền tảng (iOS & Android)
-   **Expo** – framework phát triển React Native nhanh chóng
-   **Redux Toolkit** – quản lý state toàn cục
-   **RTK Query** – quản lý API calls và caching
-   **React Navigation** – điều hướng trong ứng dụng
-   **TypeScript** – tăng cường type safety
-   **NativeWind** – styling với Tailwind CSS

---

## ⚙️ Cài đặt & chạy ứng dụng

```bash
# 1. Clone repository
git clone https://github.com/Global-Shopper/GlobalShopper_Mobile.git

# 2. Di chuyển vào thư mục dự án
cd GlobalShopper_Mobile

# 3. Cài đặt dependencies
npm install

# 4. Chạy ứng dụng
npx expo start
```

**Lưu ý:** Bạn cần cài đặt Node.js và npm trước khi bắt đầu.

### 📱 Các tùy chọn chạy ứng dụng:

-   **Android Emulator** – Nhấn `a` để mở trên Android emulator
-   **iOS Simulator** – Nhấn `i` để mở trên iOS simulator (chỉ trên macOS)
-   **Expo Go** – Quét QR code để chạy trên thiết bị thật
-   **Development Build** – Cho trải nghiệm gần với production nhất

---

## 📱 Chức năng chính

🛒 **Gửi yêu cầu mua hàng** - Có thể gửi yêu cầu có link hoặc không có link từ cửa hàng nước ngoài

🔍 **Theo dõi trạng thái đơn hàng** - Theo dõi từng bước một cách chi tiết

💳 **Quản lý ví tiền** - Nạp tiền, thanh toán, và quản lý số dư trong ứng dụng

⏪ **Hỗ trợ hoàn tiền** - Hoàn tiền nếu đơn hàng không thể thực hiện được

📲 **Thông báo realtime** - Nhận thông báo trạng thái đơn hàng theo thời gian thực

👤 **Quản lý tài khoản** - Chỉnh sửa thông tin cá nhân, địa chỉ giao hàng

🔐 **Bảo mật** - Xác thực email, đổi mật khẩu an toàn

## 🛠️ Scripts có sẵn

```bash
# Chạy ứng dụng development
npm start

# Reset dự án về trạng thái ban đầu
npm run reset-project

# Type checking với TypeScript
npx tsc --noEmit

# Lint code
npx eslint .
```

---

## 📧 Liên hệ

Mọi góp ý hoặc hỗ trợ kỹ thuật vui lòng liên hệ:

📩 **Email:** sep490gshop@gmail.com

---

## 📄 License

Dự án này thuộc về **Global Shopper Team** - SEP490 Project.

---

_Được phát triển với ❤️ bởi Global Shopper Team_
