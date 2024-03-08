import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgToastModule } from 'ng-angular-popup';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LearnMoreComponent } from './learn-more/learn-more.component';
import { HomeComponent } from './home/home.component';
import { AddBookComponent } from './add-book/add-book.component';
import { UpdateBookComponent } from './update-book/update-book.component';
import { AddNewUserComponent } from './add-new-user/add-new-user.component';
import { BooksComponent } from './books/books.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { ReadingListComponent } from './reading-list/reading-list.component';
import { SearchPipe } from './pipes/search-pipe/search.pipe';

//import app-http-interceptor
import { appHttpInterceptor } from './Interceptors/app-http.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    LearnMoreComponent,
    HomeComponent,
    AddBookComponent,
    UpdateBookComponent,
    AddNewUserComponent,
    BooksComponent,
    FooterComponent,
    PageNotFoundComponent,
    LoadingSpinnerComponent,
    ReadingListComponent,
    SearchPipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgToastModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useValue: appHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
