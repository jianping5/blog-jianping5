# LRU

最近最少使用算法，主要用于内存淘汰上。比如操作系统、MySQL、Redis 中均有对 LRU 的实现，并为应对相应的问题做了优化。

操作系统主要应对预读失效和缓存污染的问题。

MySQL 也主要应对预读失效和缓存污染的问题。

Redis 主要是应对内存使用的问题。


---

java 实现 LRU 算法：

```java
class LRUCache {

    // 创建双向链表中的节点
    class DLinkedNode {
        int key;
        int value;
        DLinkedNode next;
        DLinkedNode prev;
        DLinkedNode() {};
        DLinkedNode(int key, int value) {
            this.key = key;
            this.value = value;
        }
    }

    // 维护一个 hash 表，key 为关键字，value 为节点
    // 通过缓存数据的键映射到其在双向链表中的位置
    private HashMap<Integer, DLinkedNode> map = new HashMap<>();
    
    // 创建伪节点：头节点和尾节点
    DLinkedNode head;
    DLinkedNode tail;
    
    // 容量
    int capacity;
    
    // 双向链表大小
    int size;

    // LRUCache 类的构造函数
    public LRUCache(int capacity) {
        this.size = 0;
        this.capacity = capacity;
        head = new DLinkedNode();
        tail = new DLinkedNode();
        head.next = tail;
        tail.prev = head;
    }
    
    // 根据 key 值从缓存中获取对应节点，分两种情况：
    // 1. 若 key 不存在，则返回 -1
    // 2. 若 key 存在，则先将当前节点删除，然后再将当前节点移到双向链表的头部（表示最近访问的节点）
    // 返回该节点的值
    public int get(int key) {
        DLinkedNode node = map.getOrDefault(key, null);
        if (node == null) {
            return -1;
        }
        removeNode(node);
        moveToHead(node);
        return node.value;
    }
    
    // 添加 k-v 到缓存中，分两种情况
    // 1. 若 key 不存在，则创建新节点，并将该新节点添加到双向链表头部，size++
    // 判断当前 size 是否大于 capacity
    // 1.1 若大于，则移除双向链表尾部元素（即最近最不常访问的节点），size--
    // 1.2 若不大于，则不做操作
    // 2. 若 key 存在，则更新对应节点的 value，又由于当前访问了该节点
    // 所以需要将当前节点移到连双向链表头部（具体做法是：删除当前节点，再将当前节点添加到头部）
    public void put(int key, int value) {
        DLinkedNode node = map.get(key);
        if (node == null) {
            DLinkedNode newNode = new DLinkedNode(key, value);
            map.put(key, newNode);
            moveToHead(newNode);
            size++;
            if (size > capacity) {
                removeTail();
                size--;
            }
        } else {
            node.value = value;
            removeNode(node);
            moveToHead(node);
        }
    }

    // 将指定节点添加到链表头部
    private void moveToHead(DLinkedNode node) {
        node.next = head.next;
        head.next.prev = node;
        node.prev = head;
        head.next = node;
    }

    // 删除尾部节点，注意维护的哈希表中也需要删除对应节点
    private void removeTail() {
        map.remove(tail.prev.key);
        tail.prev.prev.next = tail;
        tail.prev = tail.prev.prev;
    }

    // 删除指定节点（用于删除该节点在被访问前所在的位置的节点）
    private void removeNode(DLinkedNode node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
}
```

---

Go 实现 LRU 算法：

```Go
package lru

import (
	"container/list"
)

// LRU cache. It is not safe for concurrent access.
type Cache struct {
	maxBytes 	int64
	nbytes 		int64
	ll			*list.List
	cache		map[string]*list.Element
	// optional and executed when an entry is purges
	OnEvicted func(key string, value Value)		
}

type entry struct {
	key		string
	value	Value
}

// Value use Len to count how many bytes it takes
type Value interface {
	Len()	int
}

// New is the Constructor of Cache
func New(maxBytes int64, onEvicted func(string, Value)) *Cache {
	return &Cache{
		maxBytes: maxBytes,
		ll: list.New(),
		cache: make(map[string]*list.Element),
		OnEvicted: onEvicted,
	}
}

// Get look ups a Key's value
func (c *Cache) Get(key string) (value Value, ok bool) {
	if ele, ok := c.cache[key]; ok {
		c.ll.MoveToFront(ele)
		// 此处为泛型转换（Value 的类型为 any）
		kv := ele.Value.(*entry)
		return kv.value, true
	}
	return
}

// RemoveOldest: removes the oldest item
func (c *Cache) RemoveOldest() {
	ele := c.ll.Back()
	if ele != nil {
		c.ll.Remove(ele)
		kv := ele.Value.(*entry)
		delete(c.cache, kv.key)
		c.nbytes -= int64(len(kv.key)) + int64(kv.value.Len())
		if c.OnEvicted != nil {
			c.OnEvicted(kv.key, kv.value)
		}
	}
}

// Add: adds a value to the cache
func (c *Cache) Add(key string, value Value) {
	if ele, ok := c.cache[key]; ok {
		c.ll.MoveToFront(ele)
		kv := ele.Value.(*entry)
		c.nbytes += int64(value.Len()) - int64(kv.value.Len())
		kv.value = value
	} else {
		ele := c.ll.PushFront(&entry{key, value})
		c.cache[key] = ele
		c.nbytes += int64(len(key)) + int64(value.Len())
	}
	
	for c.maxBytes != 0 && c.maxBytes < c.nbytes {
		c.RemoveOldest()
	}
}
```

















