
import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Credits = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Reduced for better mobile view

    const creditData = {
        'Hero Logo': 'https://bharatmaps.gov.in/BharatMaps/Assets/img/top-bg.svg',
        'ICMR': 'https://seeklogo.com/vector-logo/263355/icmr',
        'DRDO': 'https://www.google.com/imgres?q=DRDO%20logo&imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fa%2Fa2%2FDRDO_Seal.png&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FDefence_Research_and_Development_Organisation&docid=WiF57VxJRlg43M&tbnid=J7155C0AYekTsM&vet=12ahUKEwjzjIqphuiKAxVUoGMGHT4XAZAQM3oECBwQAA..i&w=300&h=300&hcb=2&ved=2ahUKEwjzjIqphuiKAxVUoGMGHT4XAZAQM3oECBwQAA',
        'BPCL': 'https://logolook.net/bharat-petroleum-corporation-limited-logo/',
        'BEL': 'https://www.facebook.com/BharatElectronicsLimited/',
        'BARC': 'https://www.javatpoint.com/barc-full-form',
        'NDA': 'https://warriorscreed.in/courses-details/33',
        'IPS': 'https://freesvg.org/ips-logo',
        'CSIR': 'https://www.facebook.com/photo.php?fbid=506407541524085&id=100064645303719&set=a.355464609951713&locale=eu_ES',
        'IIFT': 'https://en.wikipedia.org/wiki/Indian_Institute_of_Foreign_Trade',
        'JEE MAINS': 'https://w7.pngwing.com/pngs/612/865/png-transparent-central-board-of-secondary-education-ugc-net-cbse-exam-class-10-neet-jee-main-school-label-logo-india.png',
        'UGC NET': 'https://adhyayanmantra.com/ugc-net/images/ug_net_logo.png',
        'GDS': 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjdIkDoOXdyL0BakUoucj29BCS9L2c7KTfI8B-2Td3hsLYgpCC_eqyat2-QeCc3jL6-2e_3nQHxlRKrF-pohyphenhyphenLkY5uWOi6dfySwv6QZalbTD8OoSxOMYfbpCmV2Rpgdqo5a2yDWVNLeLC0/s1600/indian+postal+logo.png',
        'IOCL': 'https://download.logo.wine/logo/Indian_Oil_Corporation/Indian_Oil_Corporation-Logo.wine.png',
        'ISRO': 'https://download.logo.wine/logo/Indian_Space_Research_Organisation/Indian_Space_Research_Organisation-Logo.wine.png',
        'NPCIL': 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/NPCIL_Logo.svg/1200px-NPCIL_Logo.svg.png',
        'ONGC': 'https://download.logo.wine/logo/Oil_and_Natural_Gas_Corporation/Oil_and_Natural_Gas_Corporation-Logo.wine.png',
        'DMRC': 'https://upload.wikimedia.org/wikipedia/commons/thumb/archive/6/65/20100309023850%21Delhi_Metro_logo.svg/120px-Delhi_Metro_logo.svg.png',
        'RITES': 'https://d2un9pqbzgw43g.cloudfront.net/main/RITES_logo.png',
        'RPF': 'https://upload.wikimedia.org/wikipedia/en/e/e7/Railway_Protection_Force_Logo.png',
        'KVPY': 'https://institute.careerguide.com/wp-content/uploads/2022/05/KVPY-Logo.png',
        'NTSE': 'https://www.momentum.ac.in/uploaded-files/thumb-cache/how-would-i-manage-between-boards-and-ntseunnamed_(1)nvpl.png',
        'NEET': 'https://w7.pngwing.com/pngs/612/865/png-transparent-central-board-of-secondary-education-ugc-net-cbse-exam-class-10-neet-jee-main-school-label-logo-india.png',
        'INDIAN_POST': 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjdIkDoOXdyL0BakUoucj29BCS9L2c7KTfI8B-2Td3hsLYgpCC_eqyat2-QeCc3jL6-2e_3nQHxlRKrF-pohyphenhyphenLkY5uWOi6dfySwv6QZalbTD8OoSxOMYfbpCmV2Rpgdqo5a2yDWVNLeLC0/s1600/indian+postal+logo.png',
        'IPPB': 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjdIkDoOXdyL0BakUoucj29BCS9L2c7KTfI8B-2Td3hsLYgpCC_eqyat2-QeCc3jL6-2e_3nQHxlRKrF-pohyphenhyphenLkY5uWOi6dfySwv6QZalbTD8OoSxOMYfbpCmV2Rpgdqo5a2yDWVNLeLC0/s1600/indian+postal+logo.png',
        'NABARD': 'https://upload.wikimedia.org/wikipedia/en/thumb/f/ff/NABARD_logo.png/220px-NABARD_logo.png',
        'SBI': 'https://upload.wikimedia.org/wikipedia/en/thumb/5/58/State_Bank_of_India_logo.svg/1200px-State_Bank_of_India_logo.svg.png',
        'CISF': 'https://en.m.wikipedia.org/wiki/File:CISF_LOGO.svg',
        'APPSC': 'https://2.bp.blogspot.com/-D0rEVQOo9sQ/XMXB6fLi4iI/AAAAAAAAA2Q/OXddHBErMx4ldBQMkZ6EZzmbbgd7ublxwCLcBGAs/s1600/Screenshot_2019-04-28-20-02-07-94.png',
        'APSLPRB': 'https://upload.wikimedia.org/wikipedia/en/e/ea/Appolice%28emblem%29.png',
        'BPSC': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvAG4BBrwIj3_5FzH7qhRgCGYhkPbTXR98uw&s',
        'BSSC': 'https://w7.pngwing.com/pngs/381/126/png-transparent-scc-staff-selection-commission-logo.png',
        'BPSSC': 'https://static.toiimg.com/thumb/msid-96425736,width-400,resizemode-4/96425736.jpg',
        'BCECEB': 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.sarkarijobs.link%2Fsarkari-naukri%2Fbcece-exams-2023-dlrs-recruitment-amin-kannongo-clerk-assistant&psig=AOvVaw01zLQB4XT2maXz46snAA-h&ust=1736574319260000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJijpdG56ooDFQAAAAAdAAAAABAE',
        'BSCB': 'https://hrportal.biharscb.co.in/img/logo1.ico',
        'BSEB': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRahQLnOo_b6EH_OoBkvrwvRvuU9ow5_mtDew&s',
        'BTSC': 'https://www.jobsgyan.in/wp-content/uploads/2022/07/btsc-bihar-logo-300x300.jpg',
        'OJAS': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9QFSVpw4z5NGoMVZVBX6brbB8LhvxT0Eijw&s',
        'HIGH_COURT_OF_GUJARAT': 'https://media.licdn.com/dms/image/v2/C510BAQGByyW1UOENbA/company-logo_200_200/company-logo_200_200/0/1630595777852/guajrat_hc_logo?e=2147483647&v=beta&t=eQu5h4TGjEp0qkoaz-hBLD2r57ZmZXp0UBJ4KZ37VxQ',
        'GPSC': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Logo_GPSC.jpg/640px-Logo_GPSC.jpg',
        'GUVNL': 'https://static.wikia.nocookie.net/logopedia/images/7/73/Logo_GUVNL.png/revision/latest?cb=20200501090445',
        'PGVCL': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmj45hxD0-m1-O5H1VLu2U37gBK_05bUFzqw&s',
        'MGVCL': 'https://static.wikia.nocookie.net/logopedia/images/7/7d/Logo_MGVCL.png/revision/latest?cb=20200430195601',
        'UGVCL': 'https://static.wikia.nocookie.net/logopedia/images/0/01/Logo_UGVCL.png/revision/latest?cb=20200430201821',
        'GETCO': 'https://www.getco.co.in/grportal/images/getcologo.jpg',
        'GSECL': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl_VKAq14PwgLM8eje35FpqZdAGuswaqHGvA&s',
        'BANK_OF_BARODA': 'https://1000logos.net/wp-content/uploads/2021/06/Bank-of-Baroda-icon.png',
        'HPSC': 'https://cdn-images.prepp.in/public/college_data/images/logos/State-PSC-logo-HPSC.jpg',
        'HSSC': 'https://www.careerpower.in/blog/wp-content/uploads/2024/07/16181309/HSSC-CET-Notification-2024.webp',
        'BSEH': 'https://bseh.org.in/logo.png',
        'HPSSC': 'https://www.careerpower.in/blog/wp-content/uploads/2024/10/04204133/HPSSC-Police-Constable-Recruitment-2024.webp',
        'HighCourt Of HimachalPradesh': 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Hp-high-court-logo.png',
        'Himachal Pradesh Health Department ': 'https://th.bing.com/th/id/OIP.ON6N78UiHDFP1e8O8mvLnAHaFf?rs=1&pid=ImgDetMain',
        'HPPWD': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPeFuAKYWpDwPL6cTOt-QQJTGeesy8VP3PLg&s',
        'KPSC': 'https://upload.wikimedia.org/wikipedia/en/6/6b/Karnataka_Public_Service_Commission.jpeg',
        'KST': 'https://static.wikia.nocookie.net/logopedia/images/e/ef/Karnataka-state-police.png/revision/latest?cb=20200330054821',
        'KEA': 'https://pbs.twimg.com/profile_images/1835641842114899968/k-3Ajccf_400x400.jpg',
        'High Court Of Karnataka': 'https://upload.wikimedia.org/wikipedia/en/1/1f/Logo_of_Karnataka_High_Court.png',
        'KERALAPSC': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPEv4sa0OKjVEqPyzGXikJxKq0U93sKmgmRA&s',
        'KPRB': 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Kerala_State_Police_Logo.png',
        'Kerala State Electricity Board': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/KSEB_Logo_2022.svg/2560px-KSEB_Logo_2022.svg.png',
        'HighCourtOfKerala': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4pYuzqrJL7D7JXP9n7I9fG6mZzOshm8ACrw&s',
        'MPSC': 'https://media.assettype.com/thebridgechronicle%2F2024-09-30%2F96cxq0cn%2FMPSC-logo.jpg',
        'Maharashtra State Board of Secondary and Higher Secondary Education': 'https://www.mahahsscboard.in/LogoBord.png',
        'MSEDCL': 'https://149356857.v2.pressablecdn.com/wp-content/uploads/2018/05/MSEDCLlogo.png',
        'MaharashtraZillaParishad': 'https://images.jdmagicbox.com/comp/nanded/h8/9999p2462.2462.130321102425.j1h8/catalogue/zilla-parishad-nanded-nanded-ho-nanded-government-organisations-3sdz95w-250.jpg',
        'MPPSC': 'https://164.100.196.21/mppsc//assets/img/logo.png',
        'MPPEB': 'https://sharmajobs.com/wp-content/uploads/2018/09/PEB.jpg',
        'MPSEC': 'https://mplocalelection.gov.in/images/logo%20Latest2%20copy(1).png',
        'MPCD': "https://cooperatives.mp.gov.in/sites/default/files/inline-images/mp-logo.png",
        'Madhya Pradesh High Court': 'https://yt3.googleusercontent.com/ytc/AIdro_npfwsYw4bjqKYbdzQBaht6GOr1yRzRJrHuzrwiKDDs4g=s900-c-k-c0x00ffffff-no-rj',
        'MPPGCL': 'https://media.licdn.com/dms/image/v2/C4E0BAQHOniyfOgin9Q/company-logo_200_200/company-logo_200_200/0/1630638895194?e=2147483647&v=beta&t=uBMd7jrbizGflkMsDi2ZQsPYDFgQlI2O_-825mTtI_M',
        'MPRDC': 'https://www.developmentaid.org/files/organizationLogos/madhya-pradesh-road-development-corporation-limited-144722.jpg',
        'MPRDD': 'https://pbs.twimg.com/profile_images/1692073743089020931/5wDjlZm__400x400.jpg',
        'MPHB': 'https://i0.wp.com/texmopipe.com/wp-content/uploads/2023/11/12-MADHYA-PRADESH-HOUSING-AND-INFRA-STRUCTURE-DEVELOPMENT-BOARD.png?fit=768%2C510&ssl=1',
        'MPPCB': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs73SHZ9J2UekEzn_aiBkVvI3OHQpMtq-yxg&s',
        'OPSC': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMlrO7iWtwHW4yUExHrErDPE3MlTU9Wsp1fw&s',
        'OSSSC': 'https://sscportal.in/sites/default/files/osssc-logo-img.jpg',
        'Odisha Police': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4WUOrLIqiiBk3MMmduNAIDywIlZpMwFIjug&s',
        'High Court of Orissa': 'https://yt3.googleusercontent.com/qNd940LwXWDmDOz5KI1u7RGfB5zVYeZJnIJ-tnnYoX7p0XdT6n-xMtRy40a71PAV_JDa9x2uPXk=s900-c-k-c0x00ffffff-no-rj',
        'OSMC': 'https://play-lh.googleusercontent.com/EswxYJtnBn2BiE_ymj49KGydlPyqIkqW3BIvzmCLmiJPyQ5M0OwH-RsVTb41xIL_k_pK=w600-h300-pc0xffffff-pd',
        'OPTCL': 'https://lh6.googleusercontent.com/proxy/qZrHCy5LaMEeBkgiIEk0TVNrsWdH534mgk_HuFwJ1ssS_Nbz4bKz9UyMwKR-V6zeEggZ5uFxs4VTTZY3Gw',
        'OSSC': 'https://files.allgovernmentjobs.in/public/2019/01/03/fc752f0e83d9ce0678c0dcd80f016dab.jpg',
        'TNPSC': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX1tlBjTyMHa27WWr73fAtZNCKM4SIJZKl6Q&s',
        'TNUSRB': 'https://www.tnusrb.tn.gov.in/images/tnusrb_logo_english_new.png',
        'UKPSC': 'https://upload.wikimedia.org/wikipedia/en/a/a0/Uttarakhand_Public_Service_Commission.png',
        'UKSSSC': 'https://static.toiimg.com/thumb/msid-88671467,width-400,resizemode-4/88671467.jpg',
        'Uttarakhand Jal Vidyut Nigam\xa0Limited': 'https://static.toiimg.com/thumb/msid-88671467,width-400,resizemode-4/88671467.jpg',
        'PPSC': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRAKmGtlyjPNHFLXV3wDa7f9ispDUqqDHb1g&s',
        'PSSSB': 'https://govtjobsonly.com/wp-content/uploads/2023/08/PSSSB.png',
        'PSEB': 'https://pbs.twimg.com/profile_images/1712033937302900736/bZYTZom5_400x400.jpg',
        'PPRB': 'https://upload.wikimedia.org/wikipedia/en/f/fb/Logo_of_Punjab_Police_%28India%29.webp',
        'PHHC': 'https://highcourtchd.gov.in/images/newlogo.png',
        'PSCB': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0LglsAVcQZdpkhihKGdpBTQzeat52nRmGLg&s',
        'RSSB': 'https://rssb.rajasthan.gov.in/images/logo_img.png',
        'RPSC': 'https://static.wikia.nocookie.net/logopedia/images/5/59/RPSC.jpeg/revision/latest?cb=20200822040025',
        'HCRAJ': 'https://hcraj.nic.in/ciscopying-status-jdp/img/logo12102023.png',
        'REET': 'https://static.toiimg.com/thumb/msid-64423929,width-400,resizemode-4/64423929.jpg',
        'RSRTC': 'https://upload.wikimedia.org/wikipedia/en/5/56/Rajasthan_State_Road_Transport_Corporation_logo.png',
        'AGRI': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSil_ERXKoxXrZox1OC2_4HUCflivziMUgieQ&s',
        'Rajasthan Forest Department': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2exOqX46S82E5cAIfoSjT9173qtty6uJXAg&s',
        'ENVIRONMENT': 'https://environment.rajasthan.gov.in/content/dam/environment/images/env-climate-change-logo-macro2.png',
        'UPPSC': 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Seal_of_Uttar_Pradesh.png',
        'UPSSSC': 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Seal_of_Uttar_Pradesh.png',
        'UPPRPB': 'https://uppbpb.gov.in/Content/images/LOGO.bmp',
        'UPBEB': 'https://sharmajobs.com/wp-content/uploads/2018/10/UPBEB.png',
        'UPHESC': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIGScoqdsuV5lQtv4UVstaGeA2PEMdAfTSJA&s',
        'UPPCL': 'https://upload.wikimedia.org/wikipedia/commons/3/36/Uppcl-logo.png',
        'UPRTC': 'https://upload.wikimedia.org/wikipedia/en/e/ed/Uttar_Pradesh_State_Road_Transport_Corporation_logo.png',
        'haryana health department': 'https://www.examweb.in/wp-content/uploads/2015/06/Haryana-Health-Department-Recruitment.jpeg',
        'PSTD': 'https://th.bing.com/th/id/R.8b8a7769519293332c8974d0a97e9337?rik=j7x7IYGgpQLoGQ&riu=http%3a%2f%2folps.punjabtransport.org%2fimages%2fmvtlogo.jpg&ehk=HeTYEQXc4XGpGfb3Qy3uB0jtSPtDg8pCCDvn%2fX%2f94Zc%3d&risl=&pid=ImgRaw&r=0',
        'Hartron': 'https://skill.hartronservices.com/backend/web/images/logo.png',
        'CRB': 'https://th.bing.com/th/id/OIP.BZ6povLvw8aqsDId5u_jSQAAAA?rs=1&pid=ImgDetMain',
        'ksssb': 'https://www.hrkatha.com/wp-content/uploads/2023/09/karnataka_govt.png',
        'UPPRB': 'https://i.pinimg.com/originals/98/28/3c/98283c82ef67eb0ef4d42ae7e4072b6c.png',
        'UPMSRB': 'https://www.dpjaingroup.com/sites/default/files/2019-10/uppwd.jpg',
        'BIEAP': 'https://bieap-gov.org/wp-content/uploads/2021/09/apbise.png',
        'MPP': 'https://th.bing.com/th/id/OIP.vuroLrKall_MSUtPHZEUMAHaEO?rs=1&pid=ImgDetMain',
        'PHED': 'https://th.bing.com/th/id/OIP.STtYmBrue92W2d1XIglWsAAAAA?rs=1&pid=ImgDetMain',
        'MPAD': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIMgL5JZPI2bS_d-Ja8qvY-7DeYf4Nm6X32Q&s',
        'UPSAD': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjrYXB4h9lHRTx0rkOFEB7oHbV8GGXrXHISQ&s',
        'Andhra Pradesh': 'https://www.burningcompass.com/countries/india/maps/andhra-pradesh-outline-map.jpg',
        'Bihar': 'https://media.istockphoto.com/id/1145645990/vector/bihar-map-of-region-india.jpg?s=612x612&w=0&k=20&c=jbViB8_ObNP2riywuU9NwmfS-oc40-s5Ur4MRlAE1iI=',
        'Gujarat': 'https://image.shutterstock.com/image-vector/gujarat-map-india-region-260nw-1382970794.jpg',
        'Haryana': 'https://media.istockphoto.com/id/1318403238/vector/haryana-map-black-outline-with-shadow-on-white-background.jpg?s=612x612&w=0&k=20&c=A4Uj_xffq3wY2kO_iUPKPBQbhRqlKTOHYBzkvxyEM0g=',
        'Himanchal Pradesh': 'https://static.vecteezy.com/system/resources/previews/025/452/317/non_2x/himachal-pradesh-state-map-administrative-division-of-india-illustration-vector.jpg',
        'Karnataka': 'https://i.ytimg.com/vi/dTLwGjN0TsE/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBKI_wyvLXnGN1CM0I7chsgUBNdbw',
        'Kerala': 'https://media.istockphoto.com/id/1145646007/vector/kerala-map-of-region-india.jpg?s=612x612&w=0&k=20&c=CdOVYNhE8sUc5yjqxxlUWjGPu1XsK2IDmmL7kQFy3pI=',
        'Madhya Pradesh': 'https://i.ytimg.com/vi/HRcGWawEtns/sddefault.jpg',
        'Maharashtra': 'https://static.vecteezy.com/system/resources/previews/053/445/019/non_2x/maharashtra-state-blank-outline-map-free-vector.jpg',
        'Odisha': 'https://www.burningcompass.com/countries/india/maps/odisha-outline-map.jpg',
        'Punjab': 'https://ih1.redbubble.net/image.2054949746.2763/raf,360x360,075,t,fafafa:ca443f4786.u1.jpg',
        'Rajasthan': 'https://i.ytimg.com/vi/i7dEiZO-IlA/sddefault.jpg',
        'Tamil Nadu': 'https://i.pinimg.com/736x/97/1d/b8/971db8afe08c9fcc56e1e5f479d7e3aa.jpg',
        'Uttar Pradesh': 'https://media.istockphoto.com/id/1062548812/vector/uttar-pradesh-map-vector.jpg?s=612x612&w=0&k=20&c=Wss-zsceuJJ96vA5tZkqnEvUreJAzEu88MJaQpatYPk=',
        'Uttarakhand': 'https://wheremaps.com/wp-content/uploads/2023/06/uttarakhand-outline-map.jpg',
        'HTE': "https://www.techeduhry.gov.in/sites/default/files/1_DTE_IT%20Cell%20/Image/Haryana%20Logo.jpg",
        'SSC': "https://www.kindpng.com/picc/m/129-1298591_ssc-logo-staff-selection-commission-png-staff-selection.png",
        'MPSRTC': "https://transport.mp.gov.in/sites/default/files/mp_logo_13.png",
        'Bihar Energy Department': "https://state.bihar.gov.in/energy/cache/1/SLIDER/bihar-logo-red.png",
        'BOR': "https://bor.up.nic.in/borlogo.jpeg",
        'UPPCB': "https://uppcb.up.gov.in/downloadmedia/siteContent/202312191258465018new-logo01.jpg",
        'RSEB': "https://rajeduboard.rajasthan.gov.in/Images/logo-bw.jpg",
        'APTET': "https://education.sakshi.com/en/ap-tet/education-news/ap-tet-notification-2022-109712",
        'APEAMCET': 'https://cets.apsche.ap.gov.in/EAPCET/images/APEAPCET2024_JNTUK_LOGO.png',
        'NTA': "https://cets.apsche.ap.gov.in/EAPCET/images/APEAPCET2024_JNTUK_LOGO.png",
        'GTET': 'https://www.sebexam.org/Content/images/SEBLogo.png',
        'GSSSB': 'https://gsssb.gujarat.gov.in/Index',
        'HSTES': 'https://institute.careerguide.com/wp-content/uploads/2022/06/hstes-1.jpg',
        'HPCPMT': 'https://hpuniv.ac.in/images/hpu_logo.svg',
        'MAHATET': 'https://mahasarkar.co.in/wp-content/uploads/2024/01/maha-tet-logo-1200x1247.png',
        'MAHARASHTRA POLICE': 'https://upload.wikimedia.org/wikipedia/en/thumb/9/96/Maharashtra_Police_Insignia_India.svg/1200px-Maharashtra_Police_Insignia_India.svg.png',
        'MHTCET': 'https://upload.wikimedia.org/wikipedia/en/6/60/MHT-CET_logo.png',
        'MHSET': 'https://setexam.unipune.ac.in/Images/Univ_New_Logo.JPG',
        'OTET': 'https://application.bseodisha.ac.in/otet2023/images/logo.png',
        'OJEE': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdfDxmKFT6J2Ynhlr7tM-kYR5iothVdOQ6cA&s',
        'Rajasthan Police': 'https://upload.wikimedia.org/wikipedia/en/9/9b/Rajasthan_Police_Logo.png',
        'PSTET': 'https://cdn.aglasem.com/centralised/exam-logo/PSTET.png',
        'PSPCL': 'https://pspcl.in/assets/images/logo.png',
        'RSMSSB': 'https://odishafreejobalert.com/wp-content/uploads/2022/03/RSMSSB-LOGO.png',
        'TRB': 'https://media.9curry.com/uploads/organization/image/575/tntrb.png',
        'UPJEE': 'https://cdnbbsr.s3waas.gov.in/s325db67c5657914454081c6a18e93d6dd/uploads/2022/01/2022012945.png',
        'UPTET': 'https://www.cheggindia.com/wp-content/uploads/2021/09/UPTET-Logo-1.jpg',
        'NaBFID': 'https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/p24ghvvgfsd0fqda4hiz',
        'RRB': 'https://www.pngegg.com/en/png-phrgs',
        'EPIL': 'https://www.gkseries.com/blog/wp-content/uploads/2020/08/EPIL-2048x1136.jpeg',
        'Indian Air Force': 'https://download.logo.wine/logo/Indian_Air_Force/Indian_Air_Force-Logo.wine.png',
        'Indian Navy': 'https://toppng.com/uploads/preview/indian-navy-logo-11562975550dcedrktvmp.png',
        'Indian Army': 'https://wallpapers.com/images/hd/indian-army-logo-red-background-9yyeqs1cn57bvbtt.jpg',
        'IREL': 'https://th.bing.com/th/id/OIP.0ss-UhArQdcG0RwCbn9WrQHaHE?rs=1&pid=ImgDetMain',
        'NEIGRIHMS': 'https://s3.amazonaws.com/static.freshersworld.com/company-logo/2018/02/27/logo_429_1519735636_1.jpg',
        'IBPS': 'https://pnghq.com/wp-content/uploads/pnghq.com-ibps-logo-institute-of-banking-personnel-selection-275x400.png',
        'ICG': 'https://thozhilveedhi.com/wp-content/uploads/2020/06/INDAN-COAT-GUARD.png',
        'AAI': 'https://logodix.com/logo/1634517.jpg',
        'Indian Exim Bank': 'https://th.bing.com/th/id/OIP.9p81EoKH5Esl56fa4kzfrwHaEl?rs=1&pid=ImgDetMain',
        'NGT': 'https://www.litem.in/images/ngt.jpg',
        'IDBI': 'https://th.bing.com/th/id/OIP.XDK8kU4pq7cTV6gjvkENhQHaEK?rs=1&pid=ImgDetMain',
        'PSB': 'https://companieslogo.com/img/orig/PSB.NS-210860d7.png?t=1604670428',
        'Balmer Lawrie': 'https://upload.wikimedia.org/wikipedia/en/0/03/Balmer_Lawrie_Logo.png',
        'HAL': 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3e/Hindustan_Aeronautics_Limited_Logo.svg/1200px-Hindustan_Aeronautics_Limited_Logo.svg.png',
        'IRCON': 'https://assets-netstorage.groww.in/stock-assets/logos/GSTK541956.png',
        'HPCL': 'https://jobs.hpcl.co.in/Recruit_New/formvalidators/hpcl4.png',
        'THDC': 'https://institute.careerguide.com/wp-content/uploads/2022/07/thdc-removebg-preview.png',
        'CPCB': 'https://static.abplive.com/wp-content/uploads/2020/05/02205837/cpcb.jpeg?impolicy=abp_cdn&imwidth=720',
        'NHSRCL': 'https://th.bing.com/th/id/OIP.NQuyBlnfRXpIZ6Hgp2QrPAHaEK?rs=1&pid=ImgDetMain',
        'NCRTC': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/NCRTC_logo.png/330px-NCRTC_logo.png',
        'NGEL': 'https://th.bing.com/th/id/OIP.lBQOhhLZZAeth3O_dd6BSAHaDm?rs=1&pid=ImgDetMain',
        'IIFCL': 'https://www.iifclprojects.in/wp-content/uploads/2023/08/ipl-logo-1.png',
        'NLC': 'https://companieslogo.com/img/orig/NLCINDIA.NS-fdcb06f1.png?t=1720244493',
        'ASRB': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwW5NeZyz4BLr4c7cyXy_Gu0sK6FlxpAxYNg&s',
        'ESIC': 'https://upload.wikimedia.org/wikipedia/en/7/77/Employee_State_Insurance_Corporation_Logo.png',
        'BSF': 'https://www.livelaw.in/h-upload/2021/10/15/750x450_402454-bsf.jpg',
        'NCB': 'https://th.bing.com/th/id/OIP.MCiM1Ap1zrQepcvuLdzaewHaHV?rs=1&pid=ImgDetMain',
        'MECON': 'https://th.bing.com/th/id/OIP.8MnNz_suvFDncFrxXf11kQHaIK?rs=1&pid=ImgDetMain',
        'CIPET': 'https://jobcaam.in/wp-content/uploads/2020/10/cipet.jpg',
        'ICGEB': 'https://th.bing.com/th/id/OIP.2mziny0Nu7IANjjg7ql_AQHaHa?rs=1&pid=ImgDetMain',
        'IMU': 'https://th.bing.com/th/id/OIP.W9aZJEU5pJHnCu4NENcMYQHaHa?rs=1&pid=ImgDetMain',
        'NIT Patna': 'https://www.reviewadda.com/assets/uploads/college/logo/LOGO_13692.png',
        'RCIL': 'https://alchetron.com/cdn/railtel-corporation-of-india-1dbe7a13-573b-4409-bf55-bb688af44cc-resize-750.jpeg',
        'RVNL': 'https://dailybulls.in/wp-content/uploads/2023/07/RVNL-company-details.jpg',
        'IRCTC': 'https://th.bing.com/th/id/OIP.EHn6kkNVOvYzlxSE_p6lgwHaEK?rs=1&pid=ImgDetMain',
        'DFCCIL': 'https://www.gkseries.com/blog/wp-content/uploads/2021/04/DFCCIL-logo-683x350.png',
        'ITD': 'https://th.bing.com/th/id/OIP.C8uuy5rbXb5a6zA7L_uixAHaEK?w=768&h=432&rs=1&pid=ImgDetMain',
        'APDSC': 'https://apdsc.in/wp-content/uploads/2018/03/loggg-Copy.png',
        'SHSB': 'https://media.licdn.com/dms/image/sync/v2/D5627AQGvH-bkqC_CkA/articleshare-shrink_800/articleshare-shrink_800/0/1711354352056?e=2147483647&v=beta&t=a80Egw47vyFI8Vvzs9iOwq2eGN5f9g3hCupCeeCmLSk',
        'CCI': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMS0cjgAJf_8yBdrBrIDWPpAe7CtI_OpAwbg&s',
        'NMRC': 'https://www.nmrcnoida.com/Content/img/nmrc_logo.png',
        'DIC': 'https://tse1.mm.bing.net/th/id/OIP.S8Be87J_NUT3zspHi-iYWQHaEC?rs=1&pid=ImgDetMain',
        'DCI': 'https://th.bing.com/th/id/OIP.-bpn7hafka0O6Z00prWn4gHaCI?rs=1&pid=ImgDetMain',
        'IHM': 'https://images.shiksha.com/mediadata/images/1415083501phpqXrxPk.jpeg',
        'IIT Patna': 'https://th.bing.com/th/id/OIP.s6uoHM87WhG4OIaPbpMD9AHaHa?rs=1&pid=ImgDetMain',
        'BPNL': 'https://institute.careerguide.com/wp-content/uploads/2022/07/bpnl.jpg',
        "Search Results Not Found": "https://img.freepik.com/free-vector/search-concept-landing-page_52683-13620.jpg?ga=GA1.1.1723539104.1734412094&semt=ais_hybrid",
        "Data Not Found": "https://img.freepik.com/free-vector/postponed-concept_23-2148489217.jpg?ga=GA1.1.1723539104.1734412094&semt=ais_hybrid",
        "Gujarat Heritage": "https://statueofunitytentcity.com/wp-content/uploads/2023/05/Reaching-Statue-of-Unity-from-Ahmedabad.webp",
        "Punjab Heritage": "https://www.transindiatravels.com/wp-content/uploads/sri-harmandir-sahib.jpg",
        "Karnataka Heritage": "https://karnatakatourism.org/wp-content/uploads/2020/12/hampi-karnataka.png",
        "Haryana Heritage": "https://blogmedia.testbook.com/blog/wp-content/uploads/2023/04/adham_khans_tomb-19d8548e.jpg",
        "Bihar Heritage": "https://s7ap1.scene7.com/is/image/incredibleindia/80-feet-buddha-gaya-1-attr-hero?qlt=82&ts=1726740773690",
        "Maharashtra Heritage": "https://www.holidify.com/images/cmsuploads/compressed/1030_20190404091854.jpg",
        "Odisha Heritage": "https://www.capertravelindia.com/images/odisha-1.jpg",
        "Rajasthan Heritage": "https://travelogyindia.b-cdn.net/blog/wp-content/uploads/2016/03/Hawa-Mahal.jpg",
        "Uttar Pradesh Heritage": "https://www.indianholiday.com/wordpress/wp-content/uploads/2024/09/taj-mahal-banner-1.jpg",
        "Kerala Heritage": "https://www.ecstaticindiatours.com/uploads/travel/information/1696510525uc5nf-kerla.jpg",
        "Himachal Pradesh Heritage": "https://backend.traviyo.com/Images/Packages/AYAN_40981/637659416979097615_temp.jpg",
        "Tamil Nadu Heritage": "https://i0.wp.com/www.tusktravel.com/blog/wp-content/uploads/2023/02/Ancient-Temples-and-Ashram-Thiruvannamalai-Tamil-Nadu.jpg?resize=1024%2C850&ssl=1",
        "Madhya Pradesh Heritage": "https://www.mptourandtravels.com/images/monuments/sanchi.jpg",
        "Uttarakhand Heritage": "https://static.toiimg.com/photo/msid-113713503,width-96,height-65.cms",
        "Andhra Pradesh Heritage": "https://www.trawell.in/admin/images/upload/565594159Kurnool_Main.jpg",
        "IIT Madras": "https://doe.iitm.ac.in/wp-content/uploads/2021/06/245-2451831_iit-madras-logo.png",
        "BIS": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Bureau_of_Indian_Standards_Logo.svg/2560px-Bureau_of_Indian_Standards_Logo.svg.png",
        "BCAS": "https://bcasindia.gov.in/bcas/public/slides/1737529595_1736330413_1735826173_bcas_final.jpg",
        "IIM": "Tiruchirappalli: https://www.uxdt.nic.in/wp-content/uploads/2024/06/iit-tiruchirappalli-feature-01.jpg?x90705",
        "MoPSW": "https://shipmin.gov.in/sites/default/files/national-embelum.png",
        "DoT": "https://shipmin.gov.in/sites/default/files/national-embelum.png",
        "IIM Ahmedabad": "https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/IIM%2C_Ahmedabad_Logo.svg/1200px-IIM%2C_Ahmedabad_Logo.svg.png",
        "PRL": "https://www.prl.res.in/prl-eng/sites/default/files/images/prl_logo/prl-logo-with-text-1000x1005.png",
        "NWDA": "https://www.insightsonindia.com/wp-content/uploads/2017/06/National-water-Development-Agency-NWDA.jpg",
        "DPA": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7mRUA7IZe5VKOJNUOCMcGttIiB0dQwdRBiw&s",
        "NIA": "https://nia.gov.in/writereaddata/images/logo1.png",
        "DFPD": "https://shipmin.gov.in/sites/default/files/national-embelum.png",
        "CWC": "https://upload.wikimedia.org/wikipedia/commons/6/61/Cwclogo.jpg",
        "NSIC": "https://nsic.co.in/images/newNS.png",
        "IIT Bombay": "https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg/1200px-Indian_Institute_of_Technology_Bombay_Logo.svg.png",
        "IIT Kanpur": "https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/IIT_Kanpur_Logo.svg/1200px-IIT_Kanpur_Logo.svg.png",
        "CCRAS": "https://pbs.twimg.com/profile_images/1570355495051067392/GT2F96ng_400x400.jpg",
        "IGTR": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRBwI3mxBhnQ5Im_K-Pl81Knnx-2azqDWfGQ&s",
        "NALCO": "https://nalcoindia.com/wp-content/uploads/2018/11/image-not-available.jpg",
        "Northern Coalfields Limited": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDjCJbrABOqkAMXP8_vsDLThift5FvJRGKbg&s",
        "BRLPS": "https://shop.brlps.in/web/image/website/1/social_default_image?unique=4b985c4",
        "CBI": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL4eQAv8YVZQJnFAtnxqs-zoMtsJryohcScg&s",
        "UBI": "https://companieslogo.com/img/orig/UNIONBANK.NS-5bba728d.png?t=1720244494",
        "PHC": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Logo_of_the_High_Court_of_Patna.png/250px-Logo_of_the_High_Court_of_Patna.png",
        "APHC": "https://play-lh.googleusercontent.com/-Zs2urVhRuTU0IgtMQkaeDbwRexcA5JS_YgpryjXanaoPLPnjWfM3HD9ltv5EEy0fA",
        "AIIMS Mangalagiri": "https://upload.wikimedia.org/wikipedia/en/a/aa/All_India_Institute_of_Medical_Sciences%2C_Mangalagiri_Logo.png",
        "NADP": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVfnyWQOqcWDiICE9qbdfNmvOOu5NDljHMGg&s",
        "ICAR": "https://upload.wikimedia.org/wikipedia/en/5/55/Logo_of_Indian_Council_of_Agricultural_Research.png",
        "IIM Udaipur": "https://upload.wikimedia.org/wikipedia/en/e/ec/Indian_Institute_of_Management_Udaipur_Logo.png",
        "ECHS": "https://mahavirhospitalraj.com/wp-content/uploads/2023/03/1600x960_225052-echs-polyclinic-dimapur.jpg",
        "IIT Mandi": "https://www.iitmandi.ac.in/images/logo_hires.jpg",
        "NIT Hamirpur": "https://upload.wikimedia.org/wikipedia/en/b/b8/National_Institute_of_Technology%2C_Hamirpur_Logo.png",
        "ADA": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyjgdVV52kXCsYpQ4a-eYt7c6EacgEqnUjKQ&s",
        "IIT Dharwad": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtHuvTklVZ62PWO6d3f32yVUIe_NWYSCr3TQ&s",
        "UIDAI": "https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Aadhaar_Logo.svg/1200px-Aadhaar_Logo.svg.png",
        "CPRI": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9nqFVnTWfYAjZaczCw9I6OZEfzoiR0aW_Xg&s",
        "NIT Calicut": "https://upload.wikimedia.org/wikipedia/en/a/ae/Correct_Logo_of_NIT_Calicut.svg",
        "PB": "https://upload.wikimedia.org/wikipedia/commons/e/eb/Prasar_Bharati_logo.png",
        "CMD Kerala": "https://media.licdn.com/dms/image/v2/D560BAQFtyYgBnlIGKg/company-logo_200_200/company-logo_200_200/0/1711020674027/cmdkerala_logo?e=2147483647&v=beta&t=VunHzFA2Sy4j_UFlRyir0RboIEjkZdtTbdMy5IA71J0",
        "NAM Kerala": "https://www.ism.kerala.gov.in/eng/images/gallery/About/NAM.jpeg", 
        "THSTI": "https://thsti.res.in/public/upload/home/1734153527img.png",
        "CSEZ": "https://lh4.googleusercontent.com/proxy/2unLfw4gvDSmDjIsu8115sk4iwYJipZCy_JVV9uVc6GKazOJmxjcos4xxzsu6ZOiKhl0R0nZ4XnAtA",
        "CDAC": "https://www.presentations.gov.in/wp-content/uploads/2020/06/Preview-22.png",
        "HOCL": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-lo0OX2pRaMGtMtIlMz3gwO0fOfTigcE11A&s",
        "FDDI": "https://education.indianexpress.com/storage/images/footwear-design-and-development-institute-fddi-noidalogo_1724221925.png",
        "NAM Kerala": "https://www.ism.kerala.gov.in/eng/images/gallery/About/NAM.jpeg",
        "ICSI": "https://upload.wikimedia.org/wikipedia/commons/3/32/ICSI_Logo.PNG",
        "TMC": "https://upload.wikimedia.org/wikipedia/commons/0/0a/Tata_Memorial_Center_logo.jpg",
        "ECIL": "https://media.licdn.com/dms/image/v2/C560BAQGq-I3gfKxgOA/company-logo_200_200/company-logo_200_200/0/1630652613712?e=2147483647&v=beta&t=nN4w33PHZ9P8L1483U6TiTK1Z7KEYZO12VE9GxWy9uI",
        "AIIMS Nagpur": "https://upload.wikimedia.org/wikipedia/en/8/80/All_India_Institute_of_Medical_Sciences%2C_Nagpur_logo.png",
        "MIL": "https://upload.wikimedia.org/wikipedia/en/e/ec/Munitions_India_Limited%27s_logo.jpg",
        "NHAI": "https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/National_Highways_Authority_of_India_logo.svg/1200px-National_Highways_Authority_of_India_logo.svg.png",



    }

    const filteredData = Object.entries(creditData).filter(([key]) =>
        key.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pageCount = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pageCount) {
            setCurrentPage(newPage);
            // Scroll to top of table on mobile
            if (window.innerWidth < 768) {
                document.querySelector('.table-container')?.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    // Calculate visible page numbers
    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        for (
            let i = Math.max(1, currentPage - delta);
            i <= Math.min(pageCount, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (range[0] > 1) {
            range.unshift(1);
            if (range[1] > 2) range.splice(1, 0, '...');
        }
        if (range[range.length - 1] < pageCount) {
            if (range[range.length - 1] < pageCount - 1) range.push('...');
            range.push(pageCount);
        }
        return range;
    };

    return (
        <>
            <Helmet>
                <title>gyapak</title>
                <meta name="description" content="gyapak.in is a trusted source for the latest government exam updates, including exam dates, notifications, admit cards, and results for both central and state government departments. Stay updated with real-time information on competitive exams, application deadlines, and result announcements!" />
                <meta name="keywords" content="government competitive exams after 12th,government organisations, exam sarkari results, government calendar,current affairs,top exams for government jobs in india,Upcoming Government Exams" />
                <meta property="og:title" content="gyapak" />
                <meta property="og:description" content="Find the latest updates on government exams, admit cards, results, and application deadlines for central and state government jobs." />
            </Helmet>
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto mt-8 sm:mt-16 bg-white rounded-lg shadow">
                    {/* Header */}
                    <div className="border-b border-gray-200">
                        <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                            <button
                                onClick={() => window.history.back()}
                                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                <span className="ml-1">Back</span>
                            </button>
                            <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
                                Credits for Logos and Background
                            </h1>
                            <div className="w-20"></div> {/* Spacer for centering */}
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        {/* Search Bar */}
                        <div className="mb-6 relative">
                            <input
                                type="text"
                                placeholder="Search credits..."
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                        </div>

                        {/* Table */}
                        <div className="table-container overflow-x-auto rounded-lg border border-gray-200">
                            <table className="w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">
                                            Logo
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">
                                            Source
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentData.map(([key, value], index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                {key}
                                            </td>
                                            <td className="px-4 py-3">
                                                <a
                                                    href={value}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                                                >
                                                    View Source
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                    {currentData.length === 0 && (
                                        <tr>
                                            <td colSpan={2} className="px-4 py-8 text-center text-gray-500">
                                                No results found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-600">
                                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                                {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
                                {filteredData.length} results
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <div className="flex space-x-1">
                                    {getVisiblePages().map((page, index) => (
                                        <button
                                            key={index}
                                            onClick={() => typeof page === 'number' && handlePageChange(page)}
                                            className={`px-3 py-1 rounded-md transition-colors ${page === currentPage
                                                ? 'bg-blue-600 text-white'
                                                : page === '...'
                                                    ? 'cursor-default'
                                                    : 'hover:bg-gray-100 border border-gray-300'
                                                }`}
                                            disabled={page === '...'}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === pageCount}
                                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Next page"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Credits;
