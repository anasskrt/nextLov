const GoogleMap = () => {
  return (
    <div className="h-full">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3387.4478274758294!2d-0.6932557233977625!3d44.80405077724186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd54db4e11bb2c2d%3A0xbcd98d2c2b04715!2sms%20parking!5e1!3m2!1sfr!2sfr!4v1752012421769!5m2!1sfr!2sfr" 
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