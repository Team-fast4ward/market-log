// api 파일입니다.

// dotenv 사용 예시
import dotenv from 'dotenv';
import Navigo from 'navigo';
import { base_url, api_key, user_name, admin_email } from '../db.js';
dotenv.config();
// window.localStorage.clear(); // TODO : 삭제

const api_key = 'FcKdtJs202301';
const user_name = 'KDT4_Team3';

const headers = {
  'content-type': 'application/json',
  apikey: api_key,
  username: user_name,
};
