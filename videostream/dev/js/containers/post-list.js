import React, { Component } from "react";
import ReactHLS from 'react-hls';
import { connect } from "react-redux";
import { fetchVideoData } from "../reducers/reducer-post";

class VideoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: "",
      preState: "",
    };
  }

  renderHeader() {
    return (
      <div className="header">
        <div className="header-image">Image</div>
        <div className="header-doc-type">Title</div>
        <div className="header-comment">Running Time</div>
        <div className="header-action">Action</div>
      </div>
    );
  }

  filterMe(event) {
    const term = event.target.value.trim();
    let videos = Object.assign([], this.state.videos);
    let newVideo = [];
    
    if (term && term.length >= 2) {
      this.timeout = setTimeout(() => {
        videos.filter(function(video) {
          if (video.title.indexOf(term) !== -1) {
            newVideo.push(video);
          }
        });
        this.setState({ videos: newVideo });
      }, 300);
    }else {
      this.setState({ videos: this.state.preState });
    }
  }

  componentDidMount() {
    this.props.fetchVideoData().then(() => {
      const { videos } = this.props;
      this.setState({videos: videos[0]});
      this.setState({preState: videos[0]});
    });
  }

  renderFilterAndSearch() {
    return (
      <div className="filter">
        <input
          type="text"
          className="filter-search"
          name="comments"
          placeholder="Search"
          onChange={this.filterMe.bind(this)}
        />
      </div>
    );
  }

  getVideoDetail (id) {
    if(id) {
      const allEl = document.querySelectorAll('.videoDetail');
      allEl.forEach(function(el) {
        el.style.display = "none";
      }); 
      document.querySelector("#"+id).style.display = "flex";
    }
  }

  renderList() {
    const videosLength = this.state.videos.length;
    if(videosLength > 0) {
      return this.state.videos.map(video => {
        if(video.active) {
          return (
            <div className="container" key={video.id}>
              <div className="content-body">
                <div className="content-image"><img src={video.thumbUrl} /></div>
                <div className="content-doc">{video.title}</div>
                <div className="content-comment">{video.runningTime}</div>
                <div className="content-action">
                  <span className="button" onClick={() => this.getVideoDetail(`details${video.id}`)}>Open Detail</span>
                </div>
              </div>
              <div className="videoDetail" id={`details${video.id}`}>
                <div className="VideoPlayer"><ReactHLS url={video.videoUrl} /></div>
                  <div className="VideoInfo">
                  <div className="Video-title"><h2>{video.title}</h2></div>
                  <div className="Video-description">{video.description}</div>
                </div>
              </div>
            </div>
          );
        }
      });
    }
    
  }

  render() {    
    return (
      <div>
        {this.renderFilterAndSearch()}
        {this.renderHeader()}
        {this.renderList()}  
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    videos: state.videos
  };
}

export default connect(mapStateToProps, {fetchVideoData})(VideoList);
