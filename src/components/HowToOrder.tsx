export default function HowToOrder() {
  const steps = [
    {
      number: "01",
      title: "اختر المقاس",
      desc: "اختر مجموعة كؤوس الحجامة المناسبة لك.",
    },
    {
      number: "02",
      title: "املأ معلوماتك",
      desc: "أدخل الاسم، رقم الهاتف والولاية.",
    },
    {
      number: "03",
      title: "أكد طلبك",
      desc: "نتواصل معك لتأكيد الطلب ثم يتم الشحن.",
    },
  ];

  return (
    <section id="how-to-order" className="py-24 bg-neutral-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">كيف تطلب؟</h2>
          <p className="text-neutral-400 text-lg">خطوات بسيطة وسريعة للحصول على طلبك</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {/* Connecting Line for Desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-neutral-800 z-0"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-neutral-900 border-2 border-brand-green flex items-center justify-center text-3xl font-black text-brand-green-light mb-6 shadow-[0_0_20px_rgba(5,150,105,0.15)] group-hover:scale-110 transition-transform duration-300">
                {step.number}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-neutral-400 max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
