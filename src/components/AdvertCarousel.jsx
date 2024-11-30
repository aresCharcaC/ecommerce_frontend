import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Importa las imágenes
import banner1 from '../assets/images/carousel/banner1.jpg';
import banner2 from '../assets/images/carousel/banner2.jpg';
import descuentos from '../assets/images/carousel/descuentos.jpg';


const AdvertCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      }
    ]
  };

  const advertisements = [
    {
      id: 1,
      image: banner1,
      title: "",
      description: "Descubre lo último en Moda",
      buttonText: "Explorar",
      buttonLink: "#"
    },
    {
      id: 2,
      image: banner2,
      title: "",
      description: "Es hora de renovar tu Closet!",
      buttonText: "Ver Productos",
      buttonLink: "#"
    },
    {
      id: 3,
      image: descuentos,
      title: "",
      description: "Encuentra lo que estas buscando",
      buttonText: "Descubrir",
      buttonLink: "#"
    }
  ];

  return (
    <div className="relative w-full max-w-[1200px] mx-auto mb-8">
      <Slider {...settings}>
        {advertisements.map((ad) => (
          <div key={ad.id} className="relative">
            <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
              <img
                src={ad.image}
                alt={ad.title}
                className="w-full h-full object-cover"
                loading="lazy" // Para mejor rendimiento
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-8 transition-opacity duration-300">
                <h2 className="text-4xl font-bold mb-4 animate-fadeIn">
                  {ad.title}
                </h2>
                <p className="text-xl mb-6 animate-fadeIn animation-delay-200">
                  {ad.description}
                </p>
                <a
                  href={ad.buttonLink}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 animate-fadeIn animation-delay-400"
                >
                  {ad.buttonText}
                </a>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default AdvertCarousel;