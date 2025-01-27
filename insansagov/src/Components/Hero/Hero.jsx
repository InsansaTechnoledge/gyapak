import React, { Suspense, memo, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HeroBg from '../../assets/Landing/heroBg.webp';

const Search = memo(React.lazy(() => import('../Search/Search')));

const Hero = () => {
    const navigate = useNavigate();

    const searchHandler = useMemo(() => (input) => {
        navigate(`/search?query=${encodeURIComponent(input)}`);
    }, [navigate]);

    return (
        <div className="relative overflow-hidden h-screen flex flex-col justify-center text-center">
            <div className="absolute inset-0 z-0">
                <picture>
                    <source srcSet={`${HeroBg}?format=webp&width=480 480w, ${HeroBg}?format=webp&width=1024 1024w, ${HeroBg}?format=webp&width=1920 1920w`} type="image/webp" />
                    <img
                        src={HeroBg}
                        alt="Background"
                        loading="eager"
                        fetchpriority="high"
                        className="w-full h-full object-cover absolute inset-0"
                    />
                </picture>
            </div>

            <div className="relative z-10 px-4 text-white">
                <h1 className="text-6xl font-black tracking-tight mb-4">
                    gyapak
                </h1>
                <p className="text-xl font-semibold text-center text-gray-300 opacity-90 mb-6 tracking-wide">
                    gyapak: Dates You Need to Crack Government Exams
                </p>


                <div className="lg:max-w-md max-w-xs mx-auto mb-8">
                    <Suspense fallback={<div className="h-12 bg-white/20 animate-pulse"></div>}>
                        <Search searchHandler={searchHandler} />
                    </Suspense>
                </div>

                <div className="flex justify-center space-x-4">
                    <Link to="/trending">
                        <button className="px-6 py-3 bg-white text-black rounded-lg">
                            Trendings
                        </button>
                    </Link>
                    <a href="https://insansa.com" target="_blank" rel="noopener noreferrer">
                        <button className="px-6 py-3 border-2 border-white rounded-lg">
                            Insansa.com
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Hero;