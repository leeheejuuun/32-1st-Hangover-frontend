import React, { useEffect, useState } from 'react';
import './ProductList.scss';
import BeerImoji from '../Detail/BeerImoji';
import FilterType from './components/FilterType';
import FilterList from './components/FilterList';
import Countries from './components/countries';
import FoodPairing from './components/foodPairing';
import BigCard from '../../components/UI/BigCard';

const ProductList = () => {
  // 필터 데이터 받아오는 것
  const [filterButtons, setFilterButtons] = useState([]);
  const [countries, setCountries] = useState([]);
  const [foodPairings, setFoodPairings] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState([]);
  const [rating, setRating] = useState();

  const mappedQueryArray = filter.map(opt => [opt.type, opt.value].join('='));

  const filterQuery = !!rating
    ? mappedQueryArray.concat(`rating=${rating}`).join('&')
    : mappedQueryArray.join('&');

  console.log('query :', filterQuery);

  const handleFilter = (type, value) => {
    const isIncluded = filter.map(item => item.value).includes(value);

    isIncluded
      ? setFilter(prev => prev.filter(item => item.value !== value))
      : setFilter(prev => [...prev, { type, value }]);
  };

  const handleRating = item => {
    if (rating === item) {
      setRating();
    } else {
      setRating(item);
    }
  };

  console.log(filter);

  const postFilter = () => {
    // selectedTypes에서 value가 true인 키를 다 꺼내, 그 키들을 패치에 넘겨
    fetch(``)
      .then(res => res.json())
      .then(data => setProducts(data));
    // 필터 되서 온 데이터를 products에 다시 담아서
  };

  //주종 필터링
  useEffect(() => {
    fetch(`http://10.58.0.74:8000/product?${filterQuery}`)
      .then(res => res.json())
      .then(data => setProducts(data.result));
    // .catch(e => console.log('error', e));
  }, [filter]);

  console.log(products);
  // useEffect(() => {
  //   fetch('http://10.58.0.242:8000/products')
  //     .then(res => res.json())
  //     .then(data => setProducts(data.result));
  //   // .catch(e => console.log('error', e));
  // }, []);

  useEffect(() => {
    fetch('')
      .then(res => res.json())
      .then(data => {
        setCountries(data.countries);
        setFoodPairings(data.foodPairings);
        setFilterButtons(data.filterButton);
      });
  }, []);

  // 국가 필터링
  useEffect(() => {
    fetch('./data/countries.json')
      .then(res => res.json())
      .then(data => setCountries(data));
  }, []);
  // 가격 필터링
  useEffect(() => {
    fetch('/data/price.json')
      .then(res => res.json())
      .then(data => setPriceList(data));
  }, []);
  // 푸드 페어링 필터링
  useEffect(() => {
    fetch('./data/foodPairing.json')
      .then(res => res.json())
      .then(data => setFoodPairings(data));
  }, []);
  // 최초 데이터 요청
  useEffect(() => {
    fetch('/data/FilterList.json')
      .then(res => res.json())
      .then(data => setFilterButtons(data));
  }, []);

  // 필터링 버튼 눌렀을 때 필터링 요청
  const aaa = e => {
    e.preventDefault();

    fetch('http://10.58.6.41:8000/products', {
      method: 'POST',
      body: JSON.stringify({
        type: e.target.textContent.toLowerCase(),
      }),
    })
      .then(res => res.json())
      .then(res => setProducts(res));

    console.log(e.target.textContent.toLowerCase());
  };

  return (
    <article className="productList">
      <div className="wrapper">
        <div className="list">
          <h1 className="listCopy">
            Showing 280 wines between ₩10,000 - ₩40,000 rated above 3.8 stars
          </h1>
          <span className="listSubCopy">From 1 regional wine style</span>
          <button className="sort" type="button">
            리뷰
          </button>
          {/* <div className="buttonResultLayout">
            {filterButtonClick.map(e => {
              return;
              <div key={e.id}>{e.id}</div>;
            })}
          </div> */}
        </div>
        <div className="allLayout">
          <div className="cardLayout">
            <div className="filter">
              <FilterType title="Category" subTitle="select mutiple">
                <form className="filterList">
                  {filterButtons.map(filterButton => (
                    <FilterList
                      key={filterButton.id}
                      Filter={filterButton.Filter}
                      filter={filter}
                      handleFilter={value => handleFilter('category', value)}
                      // disabled={!setbutton}
                    />
                  ))}
                </form>
              </FilterType>

              <FilterType title="Price" subTitle="Kwd">
                <form className="filterList">
                  {priceList.map(filterButton => (
                    <FilterList
                      key={filterButton.id}
                      Filter={filterButton.price}
                      filter={filter}
                      handleFilter={value => handleFilter('price', value)}
                      // disabled={!setbutton}
                    />
                  ))}
                </form>
              </FilterType>

              <FilterType title="Rate">
                <form className="filterList">
                  <div className="raitng">
                    {[5, 4, 3, 2, 1].map(item => (
                      <div className="ratingLayout" key={item}>
                        <BeerImoji rate={item} />
                        <input
                          type="radio"
                          value={item}
                          name="checked"
                          checked={rating === item}
                          handleFilter={value => handleFilter('raitng', value)}
                          onClick={() => handleRating(item)}
                        />
                      </div>
                    ))}
                  </div>
                </form>
              </FilterType>

              <FilterType title="Country">
                <form className="filterList">
                  {countries.map(name => (
                    <Countries
                      key={name.id}
                      countryFilter={name.countryFilter}
                      filter={filter}
                      handleFilter={value => handleFilter('country', value)}
                      // countries값은 고정시키고 value만 보내
                    />
                  ))}
                </form>
              </FilterType>

              <FilterType title="foodPairing">
                <form className="filterList">
                  {foodPairings.map(filterButton => (
                    <FilterList
                      key={filterButton.id}
                      Filter={filterButton.pairing}
                      filter={filter}
                      handleFilter={value => handleFilter('foodPairing', value)}
                      // disabled={!setbutton}
                    />
                  ))}
                </form>
              </FilterType>
            </div>
          </div>

          <div className="bigCardLayout">
            {/* {products.map(it => (
              <BigCard />

            ))} */}
            {products.map(product => {
              const {
                id,
                price,
                name,
                country,
                image_url,
                rating,
                review_counts,
                // 구조분해할당
              } = product;
              return (
                <BigCard
                  key={id}
                  price={price}
                  name={name}
                  country={country}
                  image_url={image_url}
                  rating={rating}
                  review_counts={review_counts}
                />
              );
            })}
            {/* <BigCard />
            <BigCard />
            <BigCard />
            <BigCard /> */}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductList;
