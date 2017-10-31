import React from 'react';
import Loadable from 'react-loadable';
import LoadingComponent   from '../../components/LoadingComponent/LoadingComponent';
import { RestrictedRoute }   from '../../containers/RestrictedRoute';
import { Route, Switch } from 'react-router-dom';

function MyLoadable(opts, preloadComponents) {

  return Loadable(Object.assign({
    loading: LoadingComponent,
    render(loaded, props) {

      if(preloadComponents!==undefined && preloadComponents instanceof Array){
        preloadComponents.map(component=>component.preload());
      }

      let Component = loaded.default;
      return <Component {...props}/>;
    }
  }, opts));
};

const AsyncDashboard = MyLoadable({loader: () => import('../../containers/Dashboard/Dashboard')});
const AsyncHome = MyLoadable({loader: () => import('../../containers/Home/Home')});
const AsyncAbout = MyLoadable({loader: () => import('../../containers/About/About')});
const AsyncPublicChats = MyLoadable({loader: () => import('../../containers/PublicChats/PublicChats')});
const AsyncMyAccount = MyLoadable({loader: () => import('../../containers/MyAccount/MyAccount')});

const AsyncPredefinedChatMessages = MyLoadable({loader: () => import('../../containers/PredefinedChatMessages/PredefinedChatMessages')});


const AsyncTask = MyLoadable({loader: () => import('../../containers/Tasks/Task')});
const AsyncTasks = MyLoadable({loader: () => import('../../containers/Tasks/Tasks')}, [AsyncTask]);

const AsyncRole = MyLoadable({loader: () => import('../../containers/Roles/Role')});
const AsyncRoles = MyLoadable({loader: () => import('../../containers/Roles/Roles')}, AsyncRole);

const AsyncChat = MyLoadable({loader: () => import('../../containers/Chats/Chat')});
const AsyncCreateChat = MyLoadable({loader: () => import('../../containers/Chats/CreateChat')});
const AsyncChats = MyLoadable({loader: () => import('../../containers/Chats/Chats')}, [AsyncChat, AsyncCreateChat]);

const AsyncCompany = MyLoadable({loader: () => import('../../containers/Companies/Company')});
const AsyncCompanies = MyLoadable({loader: () => import('../../containers/Companies/Companies')}, [AsyncCompany]);

const AsyncLocation = MyLoadable({loader: () => import('../../containers/Locations/Location')});
const AsyncLocations = MyLoadable({loader: () => import('../../containers/Locations/Locations')}, [AsyncLocation]);

const AsyncReview = MyLoadable({loader: () => import('../../containers/Reviews/Review')});
const AsyncReviews = MyLoadable({loader: () => import('../../containers/Reviews/Reviews')}, [AsyncReview]);

const AsyncLocationPage = MyLoadable({loader: () => import('../../containers/Locations/LocationPage')}, [AsyncLocation]);


const AsyncBill = MyLoadable({loader: () => import('../../containers/Billing/Bill')});
const AsyncBilling = MyLoadable({loader: () => import('../../containers/Billing/Billing')}, [AsyncBill]);

const AsyncPost = MyLoadable({loader: () => import('../../containers/Posts/Post')});
const AsyncPosts = MyLoadable({loader: () => import('../../containers/Posts/Posts')}, [AsyncPost]);

const AsyncUser = MyLoadable({loader: () => import('../../containers/Users/User')});
const AsyncUsers = MyLoadable({loader: () => import('../../containers/Users/Users')}, [AsyncUser]);

const AsyncSignIn = MyLoadable({loader: () => import('../../containers/SignIn/SignIn')});
const AsyncPageNotFound = MyLoadable({loader: () => import('../../components/PageNotFound/PageNotFound')});

const Routes = (props, context) => {

  return (
    <Switch >
      <RestrictedRoute type='private' path="/" exact component={AsyncHome} />
      <RestrictedRoute type='private' path="/dashboard" exact component={AsyncDashboard} />

      <RestrictedRoute type='private' path="/home" exact component={AsyncHome} />

      <RestrictedRoute type='private' path="/loading" exact component={LoadingComponent} />

      <RestrictedRoute type='private' path="/public_chats" exact component={AsyncPublicChats} />

      <RestrictedRoute type='private' path="/tasks" exact component={AsyncTasks} />
      <RestrictedRoute type='private' path="/tasks/edit/:uid" exact component={AsyncTask} />
      <RestrictedRoute type='private' path="/tasks/create" exact component={AsyncTask} />

      <RestrictedRoute type='private' path="/roles" exact component={AsyncRoles} />
      <RestrictedRoute type='private' path="/roles/edit/:uid" exact component={AsyncRole} />
      <RestrictedRoute type='private' path="/roles/create" exact component={AsyncRole} />

      <RestrictedRoute type='private' path="/companies" exact component={AsyncCompanies} />
      <RestrictedRoute type='private' path="/companies/edit/:uid" exact component={AsyncCompany} />
      <RestrictedRoute type='private' path="/companies/create" exact component={AsyncCompany} />

      <RestrictedRoute type='private' path="/locations" exact component={AsyncLocations} />
      <RestrictedRoute type='private' path="/locations/edit/:uid" exact component={AsyncLocation} />
      <RestrictedRoute type='private' path="/locations/create" exact component={AsyncLocation} />

      <RestrictedRoute type='private' path="/locations/:uid" exact component={AsyncLocationPage} />


      <RestrictedRoute type='private' path="/billing" exact component={AsyncBilling} />
      <RestrictedRoute type='private' path="/billing/edit/:uid" exact component={AsyncBill} />
      <RestrictedRoute type='private' path="/billing/create" exact component={AsyncBill} />

      <RestrictedRoute type='private' path="/posts" exact component={AsyncPosts} />
      <RestrictedRoute type='private' path="/posts/edit/:uid" exact component={AsyncPost} />
      <RestrictedRoute type='private' path="/posts/create" exact component={AsyncPost} />


      <RestrictedRoute type='private' path="/reviews" exact component={AsyncReviews} />
      <RestrictedRoute type='private' path="/reviews/edit/:uid" exact component={AsyncReview} />
      <RestrictedRoute type='private' path="/reviews/create" exact component={AsyncReview} />


      <RestrictedRoute type='private' path="/predefined_chat_messages" exact component={AsyncPredefinedChatMessages} />

      <RestrictedRoute type='private' path="/chats" exact component={AsyncChats} />
      <RestrictedRoute type='private' path="/chats/edit/:uid" exact component={AsyncChat} />
      <RestrictedRoute type='private' path="/chats/create" exact component={AsyncCreateChat} />

      <RestrictedRoute type='private' path="/users" exact component={AsyncUsers} />
      <RestrictedRoute type='private' path="/users/edit/:uid/:editType" exact component={AsyncUser} />

      <RestrictedRoute type='private' path="/about" exact component={AsyncAbout}  />
      <RestrictedRoute type='private' path="/my_account"  exact component={AsyncMyAccount} />
      <RestrictedRoute type='public' path="/signin" component={AsyncSignIn} />
      <Route component={AsyncPageNotFound} />
    </Switch>

  );
}

export default Routes;
