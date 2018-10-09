// components/comment/comment.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentList:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    thumbIcon: ['luntan_dianzan@3x.png','luntan_dianzan_lan@3x.png']
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleThumbUp (e) {
      let dataset = e.currentTarget.dataset,
          commentId = dataset.id,
          thumbFlag = dataset.flag;
      this.triggerEvent('toThumbUp', { commentId, thumbFlag});
    },
    handleToReply (e) {
      let dataset = e.currentTarget.dataset,
          commentId = dataset.id,
          parentId = dataset.parentId;
      this.triggerEvent('toReply', { commentId, parentId });
    }
  }
})
