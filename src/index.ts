#!/usr/bin/env node
import { createHash } from 'crypto';
import { config } from 'dotenv';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
config();

interface Params {
    url: string;
    length: number;
}

/**
 * パスワードを生成する
 * @returns [ホスト名, パスワード]
 */
function generate({ url, length }: Params): [string, string] {
    const salt = process.env.SALT ?? 'secret';
    const { host } = new URL(url);
    const buffer = Buffer.from(`${salt}_${host}`);
    const data = createHash('sha256').update(buffer).digest('base64');
    const password = data.slice(0, length).replace('O', '0').replace('l', '1');
    return [host, password];
}

const argv = yargs(hideBin(process.argv))
    .usage('パスワードを生成する')
    .option('length', {
        description: 'パスワードの長さ',
        alias: 'l',
        type: 'number',
        default: 8,
    })
    .option('url', {
        description: 'WebサイトのURL',
        alias: 'u',
        type: 'string',
        default: 'http://localhost:8080',
    })
    .parseSync();

const { length, url } = argv;
const [host, pwd] = generate({ url, length });

console.log(`${host} :: ${pwd}`);
