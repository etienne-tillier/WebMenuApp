(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{115:function(e,t,a){"use strict";a.r(t);var n=a(55),o=a(45),s=a.n(o),r=a(56),l=a(46),i=a(13),c=a(14),u=a(16),d=a(15),p=a(0),m=a.n(p),g=a(73),h=a(72),v=a(12),_=a(48),f=a(49),b=a(22),w=function(e){Object(u.a)(a,e);var t=Object(d.a)(a);function a(){var e;Object(i.a)(this,a);for(var n=arguments.length,o=new Array(n),c=0;c<n;c++)o[c]=arguments[c];return(e=t.call.apply(t,[this].concat(o))).state={loading:!1,backdrop_path:null,episode_run_time:[],first_air_date:"",genres:[],homepage:null,id:null,name:null,networks:[],number_of_episodes:null,number_of_seasons:null,original_language:"en",overview:null,poster_path:null,status:null,type:null,vote_average:null,external_ids:{},videos:{results:[]},recommendations:{results:[]},credits:{cast:[]},modal:!1},e.loadSingleMovie=function(){var t=Object(l.a)(s.a.mark(function t(a){var n;return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.toggleLoading(),t.next=3,Object(f.h)(a);case 3:n=t.sent,e.setState(Object(r.a)(Object(r.a)(Object(r.a)({},e.state),n),{},{loading:!1})),window.scroll({top:0});case 6:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}(),e.toggleLoading=function(){e.setState({loading:!e.state.loading})},e.toggleModal=function(){e.setState({modal:!e.state.modal})},e}return Object(c.a)(a,[{key:"componentDidMount",value:function(){var e=this.props.match.params.id;this.loadSingleMovie(e)}},{key:"componentDidUpdate",value:function(e,t){var a=this.props.match.params.id;e.match.url!==this.props.match.url&&this.loadSingleMovie(a)}},{key:"render",value:function(){var e=this.state,t=e.loading,a=e.name,o=e.poster_path,s=e.first_air_date,r=e.vote_average,l=e.overview,i=e.backdrop_path,c=e.homepage,u=e.external_ids,d=e.status,f=e.genres,w=e.episode_run_time,k=e.original_language,y=e.type,j=e.networks,O=e.modal,M=this.state.credits.cast,E=this.state.recommendations.results,S=this.state.videos.results.find(function(e){return"Trailer"===e.type}),x=b.a.find(function(e){return e.iso_639_1===k}),D=this.props.match.url.split("/"),C=Object(n.a)(D,2)[1];return document.title="TMDB Clone ".concat(a?"| ".concat(a):""),m.a.createElement("section",{className:"section-show"},t?m.a.createElement(v.b,null,m.a.createElement(_.a,{type:"show"})):m.a.createElement(p.Fragment,null,m.a.createElement(g.a,{title:a,poster:o,year:s,score:r,trailer:S,text:l,backdrop_path:i,modal:O,toggleModal:this.toggleModal}),m.a.createElement(h.a,{url:C,title:a,casts:M.slice(0,5),recommendations:E,homepage:c,social:u,status:d,releaseDate:s,language:x.english_name,genres:f,episodeRuntime:w,type:y,networks:j})))}}]),a}(p.Component);t.default=w}}]);
//# sourceMappingURL=11.5c0ad8c1.chunk.js.map