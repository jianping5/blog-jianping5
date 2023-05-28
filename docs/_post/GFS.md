---
title: GFS
date: 2023-05-11
author: jianping5
location: ShangHai 
---

## Design Overview
### Architecture

![1280X1280](https://jp-typora-1310703557.cos.ap-shanghai.myqcloud.com/blog/1280X1280.PNG)

A GFS consists of

- A single master
- Multiple chunkservers
- Multiple clients

Files are divided into fixed-size chunks.

The master maintains all file system **metadata**.

GFS client code linked into each application implements the file system API and communicates with the master and chunkservers to read or write data on behalf of the application.

Clients interact with the master for metadata operations, but all data-bearing communication goes directly to the chunkservers.

**Clients do cache metadata**.


### Single Master

Having a single master vastly simplifies our design and enables the master to make sophisticated chunk placement and replication decisions using global knowledge.



### Chunk Size

Lazy space allocation avoids wasting space due to internal fragmentation, perhaps the greatest objection against such a large chunk size.

A large chunk size offers several important advantages

- it reduces clients’ need to interact with the master because reads and writes on the same chunk require only one initial request to the master for chunk location information.
- Second, since on a large chunk, a client is more likely to perform many operations on a given chunk, it can reduce network overhead by keeping a persistent TCP connection to the chunkserver over an extended period of time. 
- Third, it reduces the size of the metadata stored on the master. This allows us to keep



### Metadata

The master stores three major types of metadata: the file and chunk namespaces, the mapping from files to chunks, and the locations of each chunk’s replicas. All metadata is kept in the master’s memory.

![e5161e7b-7d90-4598-9426-7edc507163b6](https://jp-typora-1310703557.cos.ap-shanghai.myqcloud.com/blog/e5161e7b-7d90-4598-9426-7edc507163b6.png)



### Consistency Model

A relaxed consistency model.

What it does guarantee is that every piece of data stored will be written *at least once* on each replica.

A file region is consistent if all clients will always see the same data, regardless of which replicas they read from. 

A region is defined after a file data mutation if it is consistent and clients will see what the mutation writes in its entirety.

- File namespace mutations (e.g., file creation) are atomic. They are handled exclusively by the master: namespace locking guarantees atomicity and correctness (Section 4.1); the master’s operation log defines a global total order of these operations (Section 2.6.3).



## System Interactions

![2844e0f0-7444-44ea-97ed-a52ac200a176](https://jp-typora-1310703557.cos.ap-shanghai.myqcloud.com/blog/2844e0f0-7444-44ea-97ed-a52ac200a176.png)

### Leases and Mutation Order

A mutation is an operation that changes the contents or metadata of a chunk such as a write or an append operation.

The master grants a chunk lease to one of the replicas, which we call the primary.

The primary picks a serial order for all mutations to the chunk. All replicas follow this order when applying mutations.

1. The client asks the master which chunkserver holds the current lease for the chunk and the locations of the other replicas. If no one has a lease, the master grants one to a replica it chooses (not shown).
2. The master replies with the identity of the primary and the locations of the other (secondary) replicas. The client caches this data for future mutations. It needs to contact the master again only when the primary becomes unreachable or replies that it no longer holds a lease.
3. The client pushes the data to all the replicas. A client can do so in any order. Each chunkserver will store the data in an internal LRU buffer cache until the data is used or aged out. By decoupling the data flow from the control flow, we can improve performance by scheduling the expensive data flow based on the network topology regardless of which chunkserver is the primary. 
4. Once all the replicas have acknowledged receiving the data, the client sends a write request to the primary. The request identifies the data pushed earlier to all of the replicas. The primary assigns consecutive serial numbers to all the mutations it receives, possibly from multiple clients, which provides the necessary serialization. It applies the mutation to its own local state in serial number order.
5. The primary forwards the write request to all secondary replicas. Each secondary replica applies mutations in the same serial number order assigned by the primary.
6. The secondaries all reply to the primary indicating that they have completed the operation.
7. The primary replies to the client. Any errors encountered at any of the replicas are reported to the client. In case of errors, the write may have succeeded at the primary and an arbitrary subset of the secondary replicas. (If it had failed at the primary, it would not have been assigned a serial number and forwarded.) The client request is considered to have failed, and the modified region is left in an inconsistent state. Our client code handles such errors by retrying the failed mutation. It will make a few attempts at steps (3) through (7) before falling back to a retry from the beginning of the write.



### Data Flow

- We decouple the flow of data from the flow of control to use the network efficiently.
- To fully utilize each machine’s network bandwidth, the data is pushed linearly along a chain of chunkservers rather than distributed in some other topology (e.g., tree).
- To avoid network bottlenecks and high-latency links (e.g., inter-switch links are often both) as much as possible, each machine forwards the data to the “closest” machine in the network topology that has not received it.
- We minimize latency by pipelining the data transfer over TCP connections.(a switched network with full-duplex links.)



### Atomic Record Appends

GFS does not guarantee that all replicas are **bytewise identical**. It only guarantees that the

data is written at least once as an atomic unit.

> 1. 如果遇到多客户端并发，由系统统一安排追加顺序，并且单个记录追加时不会被中断。
> 2. 如果由于节点或者网络故障导致追加失败，会对记录进行重试，即保证至少写成功一次



### Snapshot

The snapshot operation makes a copy of a file or a directory tree (the “source”) almost instantaneously, while minimizing any interruptions of ongoing mutations.

Like AFS [5], we use standard **copy-on-write** techniques to implement snapshots.



## Master Operation

### Namespace Management and Locking

GFS logically represents its namespace as a lookup table mapping full pathnames to metadata.



### Replica Placement

A GFS cluster is highly distributed at more levels than one.



### Creation, Re-replication, Rebalancing

Chunk replicas are created for three reasons: chunk creation, re-replication, and rebalancing.



### Garbage Collection

#### Mechanism

The file is just renamed to a hidden name that includes the deletion timestamp.

#### Discussion

all **references to chunks**: they are in the file-to-chunk mappings maintained exclusively by the master.

all **the chunk replicas**: they are Linux files under designated directories on each chunkserver.

Any such replica not known to the master is “garbage.”

The garbage collection approach to storage reclamation offers several advantages over eager deletion.



### Stale Replica Detection

For each chunk, the master maintains a chunk version number to distinguish between up-to-date and stale replicas.



## Fault Tolerance and diagnosis

### High Availability

#### Fast recovery

Both the master and the chunkserver are designed to restore their state and start in seconds no matter how they terminated.



#### Chunk Replication

Each chunk is replicated on multiple chunkservers on different racks.



#### Master Replication

Its operation log and checkpoints are replicated on multiple machines. 



### Data Integrity

Each chunkserver uses checksumming to detect corruption of stored data.



### Diagnostic Tools

Extensive and detailed diagnostic logging has helped immeasurably in problem isolation, debugging, and performance analysis, while incurring only a minimal cost.



## Measurement



## Related Work



## Conclusions

1. We treat component failures as the **norm** rather than the exception
2. Our system provides fault tolerance by **constant monitoring**, **replicating crucial data**, and **fast and automatic recovery**.
3. Additionally, we use **checksumming** to detect data corruption at the disk or IDE subsystem level, which becomes all too common given the number of disks in the system.
4. Our design delivers high aggregate throughput to many concurrent readers and writers performing a variety of tasks. We achieve this by **separating file system control**, which passes through the master, from data transfer, which passes directly between chunkservers and clients.
5. Master involvement in common operations is **minimized** by a **large chunk size** and by **chunk leases**, which delegates authority to primary replicas in data mutations.



## References

1. [https://juejin.cn/post/7208048755123437626#heading-17](https://juejin.cn/post/7208048755123437626#heading-17)
2. [https://www.zhihu.com/tardis/zm/art/79746847?source_id=1003](https://www.zhihu.com/tardis/zm/art/79746847?source_id=1003)
3. [https://spongecaptain.cool/post/paper/googlefilesystem/](https://spongecaptain.cool/post/paper/googlefilesystem/)
4. Video: [https://www.youtube.com/watch?v=6ETFk1-53qU&feature=youtu.be](https://www.youtube.com/watch?v=6ETFk1-53qU&feature=youtu.be)
5. Lecture: [http://nil.csail.mit.edu/6.824/2022/notes/l-gfs.txt](http://nil.csail.mit.edu/6.824/2022/notes/l-gfs.txt)
6. FAQ: [http://nil.csail.mit.edu/6.824/2022/papers/gfs-faq.txt](http://nil.csail.mit.edu/6.824/2022/papers/gfs-faq.txt)
7. Paper: [http://nil.csail.mit.edu/6.824/2022/papers/gfs.pdf](http://nil.csail.mit.edu/6.824/2022/papers/gfs.pdf)



## Q & A

**Why is atomic record append at-least-once, rather than exactly
once?**

Section 3.1, Step 7, says that if a write fails at one of the 
secondaries, the client re-tries the write. That will cause the data
to be appended more than once at the non-failed replicas. A different
design could probably detect duplicate client requests despite
arbitrary failures (e.g. a primary failure between the original
request and the client's retry). You'll implement such a design in Lab
3, at considerable expense in complexity and performance.


**How does an application know what sections of a chunk consist of
padding and duplicate records?**

To detect padding, applications can put a predictable magic number
at the start of a valid record, or include a checksum that will likely
only be valid if the record is valid. The application can detect
duplicates by including unique IDs in records. Then, if it reads a
record that has the same ID as an earlier record, it knows that they
are duplicates of each other. GFS provides a library for applications
that handles these cases.


**How can clients find their data given that atomic record append
writes it at an unpredictable offset in the file?**

Append (and GFS in general) is mostly intended for applications
that sequentially read entire files. Such applications will scan the
file looking for valid records (see the previous question), so they
don't need to know the record locations in advance. For example, the
file might contain the set of link URLs encountered by a set of
concurrent web crawlers. The file offset of any given URL doesn't
matter much; readers just want to be able to read the entire set of
URLs.


**What's a checksum?**

A checksum algorithm takes a block of bytes as input and returns a
single number that's a function of all the input bytes. For example, a
simple checksum might be the sum of all the bytes in the input (mod
some big number). GFS stores the checksum of each chunk as well as the
chunk. When a chunkserver writes a chunk on its disk, it first
computes the checksum of the new chunk, and saves the checksum on disk
as well as the chunk. When a chunkserver reads a chunk from disk, it
also reads the previously-saved checksum, re-computes a checksum from
the chunk read from disk, and checks that the two checksums match. If
the data was corrupted by the disk, the checksums won't match, and the
chunkserver will know to return an error. Separately, some GFS
applications stored their own checksums, over application-defined
records, inside GFS files, to distinguish between correct records and
padding. CRC32 is an example of a checksum algorithm.

**The paper mentions reference counts -- what are they?**

They are part of the implementation of copy-on-write for snapshots.
When GFS creates a snapshot, it doesn't copy the chunks, but instead
increases the reference counter of each chunk. This makes creating a
snapshot inexpensive. If a client writes a chunk and the master
notices the reference count is greater than one, the master first
makes a copy so that the client can update the copy (instead of the
chunk that is part of the snapshot). You can view this as delaying the
copy until it is absolutely necessary. The hope is that not all chunks
will be modified and one can avoid making some copies.

**If an application uses the standard POSIX file APIs, would it need
to be modified in order to use GFS?**

Yes, but GFS isn't intended for existing applications. It is
designed for newly-written applications, such as MapReduce programs.

**How does GFS determine the location of the nearest replica?**

The paper hints that GFS does this based on the IP addresses of the
servers storing the available replicas. In 2003, Google must have
assigned IP addresses in such a way that if two IP addresses are close
to each other in IP address space, then they are also close together
in the machine room.

**What's a lease?**

For GFS, a lease is a period of time in which a particular
chunkserver is allowed to be the primary for a particular chunk.
Leases are a way to avoid having the primary have to repeatedly ask
the master if it is still primary -- it knows it can act as primary
for the next minute (or whatever the lease interval is) without
talking to the master again.

**Suppose S1 is the primary for a chunk, and the network between the
master and S1 fails. The master will notice and designate some other
server as primary, say S2. Since S1 didn't actually fail, are there
now two primaries for the same chunk?**

That would be a disaster, since both primaries might apply
different updates to the same chunk. Luckily GFS's lease mechanism
prevents this scenario. The master granted S1 a 60-second lease to be
primary. S1 knows to stop being primary before its lease expires. The
master won't grant a lease to S2 until after the previous lease to S1
expires. So S2 won't start acting as primary until after S1 stops.

**64 megabytes sounds awkwardly large for the chunk size!**

The 64 MB chunk size is the unit of book-keeping in the master, and
the granularity at which files are sharded over chunkservers. Clients
could issue smaller reads and writes -- they were not forced to deal
in whole 64 MB chunks. The point of using such a big chunk size is to
reduce the size of the meta-data tables in the master, and to avoid
limiting clients that want to do huge transfers to reduce overhead. On
the other hand, files less than 64 MB in size do not get much
parallelism.

**Does Google still use GFS?**

Rumor has it that GFS has been replaced by something called
Colossus, with the same overall goals, but improvements in master
performance and fault-tolerance. In addition, many applications within
Google have switched to more database-like storage systems such as
BigTable and Spanner. However, much of the GFS design lives on in
HDFS, the storage system for the Hadoop open-source MapReduce.

**How acceptable is it that GFS trades correctness for performance
and simplicity?**

This a recurring theme in distributed systems. Strong consistency
usually requires protocols that are complex and require chit-chat
between machines (as we will see in the next few lectures). By
exploiting ways that specific application classes can tolerate relaxed
consistency, one can design systems that have good performance and
sufficient consistency. For example, GFS optimizes for MapReduce
applications, which need high read performance for large files and are
OK with having holes in files, records showing up several times, and
inconsistent reads. On the other hand, GFS would not be good for
storing account balances at a bank.

**What if the master fails?**

There are replica masters with a full copy of the master state; the
paper's design requires some outside entity (a human?) to decide to
switch to one of the replicas after a master failure (Section 5.1.3).
We will see later how to build replicated services with automatic
cut-over to a backup, using Raft.

**Why 3 replicas?**

Perhaps this was the line of reasoning: two replicas are not enough
because, after one fails, there may not be enough time to re-replicate
before the remaining replica fails; three makes that scenario much
less likely. With 1000s of disks, low-probabilty events like multiple
replicas failing in short order occur uncomfortably often. Here is a
study of disk reliability from that era:
https://research.google.com/archive/disk_failures.pdf. You need to
factor in the time it takes to make new copies of all the chunks that
were stored on a failed disk; and perhaps also the frequency of power,
server, network, and software failures. The cost of disks (and
associated power, air conditioning, and rent), and the value of the
data being protected, are also relevant.

**Did having a single master turn out to be a good idea?**

That idea simplified initial deployment but was not so great in the
long run. This article (GFS: Evolution on Fast Forward,
https://queue.acm.org/detail.cfm?id=1594206) says that as the years
went by and GFS use grew, a few things went wrong. The number of files
grew enough that it wasn't reasonable to store all files' metadata in
the RAM of a single master. The number of clients grew enough that a
single master didn't have enough CPU power to serve them. The fact
that switching from a failed master to one of its backups required
human intervention made recovery slow. Apparently Google's replacement
for GFS, Colossus, splits the master over multiple servers, and has
more automated master failure recovery.

**What is internal fragmentation? Why does lazy allocation help?**

Internal fragmentation is the space wasted when a system uses an
allocation unit larger than needed for the requested allocation. If
GFS allocated disk space in 64MB units, then a one-byte chunk would
waste almost 64MB of disk. GFS avoids this problem by allocating disk
space lazily. Every chunk is a Linux file, and Linux file systems use
block sizes of a few tens of kilobytes; so when an application creates
a 1-byte GFS file, the file's chunk consumes only one Linux disk
block, not 64 MB.

**What benefit does GFS obtain from the weakness of its consistency?**

It's easier to think about the additional work GFS would have to do
to achieve stronger consistency.

The primary should not let secondaries apply a write unless all
secondaries will be able to do it. This likely requires two rounds of
communication -- one to ask all secondaries if they are alive and are
able to promise to do the write if asked, and (if all answer yes) a
second round to tell the secondaries to commit the write.

If the primary dies, some secondaries may have missed the last few
messages the primary sent. Before resuming operation, a new primary
should ensure that all the secondaries have seen exactly the same
sequence of messages.

Since clients re-send requests if they suspect something has gone
wrong, primaries would need to filter out operations that have already
been executed.

Clients cache chunk locations, and may send reads to a chunkserver
that holds a stale version of a chunk. GFS would need a way to
guarantee that this cannot succeed.
