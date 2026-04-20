import React, { useState } from 'react';

const Register = ({ navigate }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');

  const handleCountryChange = (e) => setPhone(e.target.value + " ");

  return (
    <div className="auth-screen">
      <div className="auth-card">
        {step === 1 && (
          <>
            <h2>خطوة 1/4</h2>
            <select onChange={handleCountryChange}>
              <option value="">اختر الدولة</option>
              <option value="+20">مصر (+20)</option>
              <option value="+966">السعودية (+966)</option>
              <option value="+971">الإمارات (+971)</option>
              <option value="+212">المغرب (+212)</option>
            </select>
            <input type="tel" placeholder="رقم الهاتف" value={phone} onChange={(e)=>setPhone(e.target.value)} />
            <button className="btn-p" onClick={() => setStep(2)}>التالي</button>
          </>
        )}
        {step === 2 && (
          <>
            <h2>خطوة 2/4</h2>
            <input type="text" placeholder="الاسم الكامل" />
            <input type="email" placeholder="البريد الإلكتروني" />
            <button className="btn-p" onClick={() => setStep(3)}>التالي</button>
          </>
        )}
        {step === 3 && (
          <>
            <h2>خطوة 3/4</h2>
            <input type="date" />
            <input type="password" placeholder="كلمة المرور" />
            <button className="btn-p" onClick={() => setStep(4)}>التالي</button>
          </>
        )}
        {step === 4 && (
          <>
            <h2>تأكيد الحساب</h2>
            <input type="password" placeholder="تأكيد كلمة المرور" />
            <button className="btn-p" onClick={() => navigate('home')}>إتمام التسجيل والدخول</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
