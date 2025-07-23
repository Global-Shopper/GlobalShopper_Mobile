import axios from 'axios';

const geoApi = axios.create({
  baseURL: 'https://esgoo.net/api-tinhthanh',
  timeout: 10000,
});

async function fetchData(path) {
  const res = await geoApi.get(path);
  if (res.data.error !== 0) throw new Error('API Error');
  return res.data.data;
}

export function getProvinces() {
  return fetchData('/1/0.htm');
}

export function getDistricts(provinceId) {
  return fetchData(`/2/${provinceId}.htm`);
}

export function getWards(districtId) {
  return fetchData(`/3/${districtId}.htm`);
}

export function getFullHierarchy() {
  return fetchData('/4/0.htm');
}

export function resolveName(id) {
  return fetchData(`/5/${id}.htm`);
}
