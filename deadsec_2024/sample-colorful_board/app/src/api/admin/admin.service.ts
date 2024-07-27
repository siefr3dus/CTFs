import { HttpException, Injectable } from '@nestjs/common';
import { Notice, NoticeDocument, } from 'src/common/schemas';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as puppeteer from 'puppeteer';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Notice.name)
        private noticeModel: Model<NoticeDocument>,

        private userService: UserService,
        private authService: AuthService,

    ) { }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getAllNotice() {
        const notices = await this.noticeModel.find();

        return notices;
    }

    async getNotice(id: Types.ObjectId) {
        const notice = await this.noticeModel.findById(id);
        if (!notice) throw new HttpException('No Notice', 404);

        return notice;
    }

    async viewUrl(url: string) {
        const admin = await this.userService.getUserByUsername(process.env.ADMIN_ID);
        const token = await this.authService.getAccessToken(admin);
        const cookies = [{ "name": "accessToken", "value": token.accessToken, "domain": "localhost" }]
        console.log(token);

        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium',
            args: ["--no-sandbox"]
        });

        const page = await browser.newPage();
        await page.setCookie(...cookies);

        await page.goto(url);
        await this.delay(500);

        await browser.close();
        return;
    }

    async authorize(username: string) {
        return await this.userService.authorizeUser(username);
    }
}
