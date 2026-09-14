type AlumniNameParts = {
  firstName: string;
  lastName: string;
};

const HISTORICAL_HEADSHOTS: Readonly<Record<string, string>> = {
  "gary shen": "/alumni/historical/2018-2019/gary-shen.png",
  "shan srikanthan": "/alumni/historical/2018-2019/shan-srikanthan.jpg",
  "austin baggio": "/alumni/historical/2018-2019/austin-baggio.jpg",
  "michelle chen": "/alumni/historical/2018-2019/michelle-chen.jpg",
  "jason cho": "/alumni/historical/2018-2019/jason-cho.jpg",
  "katja kirtavit": "/alumni/historical/2018-2019/katja-kirtavit.jpg",
  "anirudha nandi": "/alumni/historical/2018-2019/anirudha-nandi.jpg",
  "katherine tang": "/alumni/historical/2018-2019/katherine-tang.jpg",
  "amy wang": "/alumni/historical/2018-2019/amy-wang.jpg",
  "dapo folami": "/alumni/historical/2019-2020/dapo-folami.jpg",
  "jane wang": "/alumni/historical/2019-2020/jane-wang.jpg",
  "alysaa co": "/alumni/historical/2019-2020/alysaa-co.jpg",
  "alyssa co": "/alumni/historical/2019-2020/alysaa-co.jpg",
  "christine richards": "/alumni/historical/2019-2020/christine-richards.jpg",
  "bohan jiang": "/alumni/historical/2019-2020/bohan-jiang.jpg",
  "brock lumbard": "/alumni/historical/2019-2020/brock-lumbard.jpg",
  "fawaz mohammad": "/alumni/historical/2019-2020/fawaz-mohammad.jpg",
  "lucille xiong": "/alumni/historical/2020-2021/lucille-xiong.jpg",
  "cem torun": "/alumni/historical/2020-2021/cem-torun.jpg",
  "andrew liu": "/alumni/historical/2020-2021/andrew-liu.jpg",
  "zain huda": "/alumni/historical/2020-2021/zain-huda.png",
  "maanasa pillai": "/alumni/historical/2020-2021/maanasa-pillai.jpg",
  "jenny li": "/alumni/historical/2020-2021/jenny-li.jpg",
  "jenny liu": "/alumni/historical/2020-2021/jenny-liu.jpeg",
  "jeffrey chen": "/alumni/historical/2020-2021/jeffrey-chen.jpg",
  "donna xue": "/alumni/historical/2021-2022/donna-xue.jpg",
  "sajin kowser": "/alumni/historical/2021-2022/sajin-kowser.jpg",
  "prapthi agarwala": "/alumni/historical/2021-2022/prapthi-agarwala.JPG",
  "david george": "/alumni/historical/2021-2022/david-george.PNG",
  "jenny song": "/alumni/historical/2021-2022/jenny-song.jpg",
  "sam zhang": "/alumni/historical/2021-2022/sam-zhang.jpg",
  "owen hodges": "/alumni/historical/2021-2022/owen-hodges.jpeg",
  "amanda adam": "/alumni/historical/2021-2022/amanda-adam.jpg",
  "sam mcdougall": "/alumni/historical/2021-2022/sam-mcdougall.jpg",
  "samantha mcdougall": "/alumni/historical/2021-2022/sam-mcdougall.jpg",
  "anjana somar": "/alumni/historical/2022-2023/anjana-somar.jpg",
  "janice xu": "/alumni/historical/2022-2023/janice-xu.jpg",
  "nathan pogue": "/alumni/historical/2022-2023/nathan-pogue.jpg",
  "celina shen": "/alumni/historical/2022-2023/celina-shen.jpg",
  "rosy ren": "/alumni/historical/2022-2023/rosy-ren.jpg",
  "tanay shah": "/alumni/historical/2022-2023/tanay-shah.jpg",
  "sabrina wen": "/alumni/historical/2022-2023/sabrina-wen.jpg",
  "allen lam": "/alumni/historical/2022-2023/allen-lam.jpg",
  "allan lam": "/alumni/historical/2022-2023/allen-lam.jpg",
  "shankari sivanathan": "/alumni/historical/2022-2023/shankari-sivanathan.jpg",
  "sonya cao": "/alumni/historical/2022-2023/sonya-cao.jpg",
};

function normalizeName(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function getAlumniHeadshot({ firstName, lastName }: AlumniNameParts) {
  return HISTORICAL_HEADSHOTS[normalizeName(`${firstName} ${lastName}`)] ?? null;
}
