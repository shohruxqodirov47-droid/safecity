@echo off
chcp 65001 > nul
color 0A

echo =======================================================
echo     SafeCity AI - Avtomatik Baza Ulanish Dasturi
echo =======================================================
echo.

set /p PASS="Iltimos, Supabase loyihangiz PAROLINI kiriting va Enter bosing: "

echo DATABASE_URL="postgresql://postgres.deukfpjvuwshyifciyus:%PASS%@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres" > .env
echo DIRECT_URL="postgresql://postgres.deukfpjvuwshyifciyus:%PASS%@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres" >> .env

echo.
echo Parol qabul qilindi. Hozir avtomat baza ulanadi, iltimos kuting...
echo.

call npx prisma db push

echo.
echo =======================================================
echo TAYYOR! Hammasi muvaffaqiyatli yakunlandi. 
echo Ushbu qora oynani yopishingiz mumkin.
echo =======================================================
pause
