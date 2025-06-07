const GoogleMap = () => {
  return (
    <div className="h-full">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2833.2658240971105!2d-0.5300935236577223!3d44.75499318047789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x45269a70471ec779%3A0x234d16901bac811f!2sTerrassement%20-%20kerloc-terrassement!5e0!3m2!1sfr!2sfr!4v1748722104467!5m2!1sfr!2sfr" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Localisation de l'entreprise"
      />
    </div>
  );
};

export default GoogleMap;