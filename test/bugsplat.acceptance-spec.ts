import { async, TestBed } from "@angular/core/testing";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { RequestOptions } from "@angular/http";
import { TestBedInitializer } from './init';
import { BugSplat } from "../src/bugsplat";
import { BugSplatConfiguration } from "../src/bugsplat-config";
import { BugSplatLogger } from "../src/bugsplat-logger";

const testUser = "Fred";
const testPassword = "Flintstone";
const testDatabase = "octomore"

describe('BugSplat', () => {

    let testBed: typeof TestBed;

    beforeAll(() => {
        testBed = TestBedInitializer.getTestBed();
    });

    beforeEach(() => testBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [HttpClient]
    }));

    it('should post crash with all properties', async(() => {
        const http: HttpClient = testBed.get(HttpClient);
        const appName = "bugsplat-ng4-tests";
        const database = testDatabase;
        const appVersion = "1.0.0.0";
        const appKey = "Key!";
        const user = "Fred Flintstone";
        const email = "fred@bedrock.com";
        const description = "Description!";
        const errorMessage = "foobar!";
        const config = new BugSplatConfiguration(appName, appVersion, database);
        const bugsplat = new BugSplat(config, http, new BugSplatLogger());
        bugsplat.appKey = appKey;
        bugsplat.user = user;
        bugsplat.email = email;
        bugsplat.description = description;
        bugsplat.getObservable().subscribe(event => {
            const expectedCrashId = event.responseData.crash_id;
            const baseUrl = "http://" + testDatabase + ".bugsplat.com";
            const loginUrl = baseUrl + "/api/authenticate.php";
            const options = { withCredentials: true };
            const body = new FormData();
            body.append("email", testUser);
            body.append("password", testPassword);
            http.post(loginUrl, body, options).subscribe(data => {
                const individualCrashUrl = baseUrl + "/browse/individualCrash.php?database=" + testDatabase + "&id=" + expectedCrashId;
                http.get(individualCrashUrl + "&data", options).subscribe(data => {
                    const dataAny = <any>data;
                    expect(dataAny.additionalInfo).toEqual(description);
                    expect(dataAny.appDescription).toEqual(appKey);
                    expect(dataAny.appName).toEqual(appName);
                    expect(dataAny.appVersion).toEqual(appVersion);
                    expect(dataAny.email).toEqual(email);
                    expect(dataAny.user).toEqual(user);
                }, err => {
                    console.error("IndividualCrash &data GET error:", err);
                    throw new Error(err.message);
                });
            }, err => {
                console.error("Login POST error:", err);
                throw new Error(err.message);
            });
        });
        bugsplat.post(new Error(errorMessage))
    }), 30000);
});
