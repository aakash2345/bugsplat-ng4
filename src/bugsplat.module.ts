
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { BugSplatErrorHandler } from "./bugsplat-error-handler";
import { BugSplat } from "./bugsplat";
import { Logger, BugSplatLogger } from "./bugsplat-logger";

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [
        BugSplatErrorHandler
    ],
    exports: [
        BugSplat
    ]
})
export class BugSplatModule { }