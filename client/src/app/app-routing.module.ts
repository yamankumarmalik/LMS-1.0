import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBookComponent } from './add-book/add-book.component';
import { AddNewUserComponent } from './add-new-user/add-new-user.component';
import { authGuard } from './auth/auth.guard';
import { BooksComponent } from './books/books.component';
import { HomeComponent } from './home/home.component';
import { LearnMoreComponent } from './learn-more/learn-more.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UpdateBookComponent } from './update-book/update-book.component';
import { ReadingListComponent } from './reading-list/reading-list.component';
import { adminGuard } from './auth/admin.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'learnMore',
    component: LearnMoreComponent,
  },
  {
    path: 'books', //books are displayed in this component
    component: BooksComponent,
  },
  {
    path: 'addBook', //add book userAdmin
    component: AddBookComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'updateBook', //update Book detail userAdmin
    component: UpdateBookComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'addNewUser', //addNewUser
    component: AddNewUserComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'readingList', //userReadingList
    component: ReadingListComponent,
    canActivate: [authGuard],
  },
  {
    path: '', //redirect to home component
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '**', //wildcard route for a 404 page
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
