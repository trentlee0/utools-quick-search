<template>
  <div class="list">
    <Item
      v-for="item in data"
      :icon="item.icon"
      :title="item.title"
      :subtitle="item.subtitle"
      :keyword="item.keyword"
    >
    </Item>
  </div>
</template>

<script setup lang="ts">
import Item from './Item.vue'
import {reactive} from 'vue'

interface ListItemProp {
  title: string
  subtitle?: string
  icon?: string
  keyword?: string
}

const {data} = withDefaults(
  defineProps<{
    data: Array<ListItemProp>
    loading?: boolean
  }>(),
  {
    loading: false
  }
)

const listData = reactive([
  {
    title: 'Hello',
    subtitle: 'ffdasffdsafda',
    icon: 'https://img0.baidu.com/it/u=1472391233,99561733&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1666544400&t=d5daee453462255eb4d0fe7c29511d87',
    keyword: 'hello'
  },
  {
    title: 'Hello',
    // subtitle: '本人也是经过了深思熟虑,在每个日日夜夜思考这个问题. 生活中, 若随机一段废话出现了, 我们就不得不考虑它出现了的事实. 那么, 我认为, 一般来说, 随机一段废话, 到底应该如何实现. 生活中, 若随机一段废话出现了, 我们就不得不考虑它出现了的事实. 笛卡儿在不经意间这样说过, 读一切好书，就是和许多高尚的人谈话。这不禁令我深思。这种事实对本卡莱尔说过一句著名的话, 过去一切时代的精华尽在书中。这启发了我. 所谓随机一段废话, 关键是随机一段废话需要如何写. 既然如何, 德国在不经意间这样说过, 只有在人群中间，才能认识自己。',
    icon: 'https://img0.baidu.com/it/u=1472391233,99561733&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1666544400&t=d5daee453462255eb4d0fe7c29511d87',
    keyword: 'hello'
  }
])
</script>

<style lang="sass" scoped></style>
