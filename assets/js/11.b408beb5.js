(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{299:function(e,t,a){e.exports=a.p+"assets/img/1.dc0581d0.png"},334:function(e,t,a){"use strict";a.r(t);var r=a(5),s=Object(r.a)({},(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h2",{attrs:{id:"abstract"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#abstract"}},[e._v("#")]),e._v(" Abstract")]),e._v(" "),t("h2",{attrs:{id:"introduction"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#introduction"}},[e._v("#")]),e._v(" Introduction")]),e._v(" "),t("p",[e._v("The major contributions of this work are a simple and powerful interface that enables automatic parallelization and distribution of large-scale computations, combined with an implementation of this interface that achieves high performance on large clusters of commodity PCs.")]),e._v(" "),t("h2",{attrs:{id:"programming-model"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#programming-model"}},[e._v("#")]),e._v(" Programming Model")]),e._v(" "),t("p",[t("img",{attrs:{src:a(299),alt:"1.png"}})]),e._v(" "),t("h2",{attrs:{id:"implementation"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#implementation"}},[e._v("#")]),e._v(" Implementation")]),e._v(" "),t("h3",{attrs:{id:"execution-overview"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#execution-overview"}},[e._v("#")]),e._v(" Execution Overview")]),e._v(" "),t("p",[e._v("Figure 1 shows the overall flow of a MapReduce operation in our implementation. When the user program")]),e._v(" "),t("p",[e._v("calls the MapReduce function, the following sequence of actions occurs (the numbered labels in Figure 1 correspond to the numbers in the list below):")]),e._v(" "),t("ol",[t("li",[e._v("The MapReduce library in the user program first splits the input files into M pieces of typically 16 megabytes to 64 megabytes (MB) per piece (controllable by the user via an optional parameter). It then starts up many copies of the program on a cluster of machines.")]),e._v(" "),t("li",[e._v("One of the copies of the program is special – the master. The rest are workers that are assigned work by the master. There are M map tasks and R reduce tasks to assign. The master picks idle workers and assigns each one a map task or a reduce task.")]),e._v(" "),t("li",[e._v("A worker who is assigned a map task reads the contents of the corresponding input split. It parses key/value pairs out of the input data and passes each pair to the user-defined Map function. The intermediate key/value pairs produced by the Map function are buffered in memory.")]),e._v(" "),t("li",[e._v("Periodically, the buffered pairs are written to local disk, partitioned into R regions by the partitioning function. The locations of these buffered pairs on the local disk are passed back to the master, who is responsible for forwarding these locations to the reduce workers.")]),e._v(" "),t("li",[e._v("When a reduce worker is notified by the master about these locations, it uses remote procedure calls to read the buffered data from the local disks of the map workers. When a reduce worker has read all intermediate data, it sorts it by the intermediate keys so that all occurrences of the same key are grouped together. The sorting is needed because typically many different keys map to the same reduce task. If the amount of intermediate data is too large to fit in memory, an external sort is used.")]),e._v(" "),t("li",[e._v("The reduce worker iterates over the sorted intermediate data and for each unique intermediate key encountered, it passes the key and the corresponding set of intermediate values to the user’s Reduce function. The output of the Reduce function is appended to a final output file for this reduce partition.")]),e._v(" "),t("li",[e._v("When all map tasks and reduce tasks have been completed, the master wakes up the user program. At this point, the MapReduce call in the user program returns back to the user code.")])]),e._v(" "),t("h3",{attrs:{id:"master-data-structures"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#master-data-structures"}},[e._v("#")]),e._v(" Master Data Structures")]),e._v(" "),t("p",[e._v("For each map，task and reduce task, it stores the state (idle, in-progress, or completed), and the identity of the worker machine (for non-idle tasks).")]),e._v(" "),t("h3",{attrs:{id:"fault-tolerance"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#fault-tolerance"}},[e._v("#")]),e._v(" Fault Tolerance")]),e._v(" "),t("p",[t("strong",[e._v("Worker Failure")])]),e._v(" "),t("p",[e._v("The master pings every worker periodically.")]),e._v(" "),t("p",[e._v("Who needs to be reset to idle and becomes eligible for rescheduling?")]),e._v(" "),t("ul",[t("li",[e._v("Any map tasks completed (because their output is stored on the local disk(s) of the failed machine and is therefore inaccessible)")]),e._v(" "),t("li",[e._v("Any map task or reduce task in progress")])]),e._v(" "),t("blockquote",[t("p",[e._v("Completed reduce tasks do not need to be re-executed since their output is stored in a global file system.")])]),e._v(" "),t("p",[t("strong",[e._v("Master Failure")])]),e._v(" "),t("p",[e._v("It is easy to make the master write periodic checkpoints of the master data structures described above.")]),e._v(" "),t("p",[t("strong",[e._v("Semantics in the Presence of Failures")])]),e._v(" "),t("p",[e._v("When the user-supplied map and reduce operators are "),t("strong",[e._v("deterministic")]),e._v(" functions of their input values, our distributed implementation produces the same output as would have been produced by a non-faulting sequential execution of the entire program.")]),e._v(" "),t("p",[e._v("We rely on "),t("strong",[e._v("atomic commits")]),e._v(" of map and reduce task outputs to achieve this property.")]),e._v(" "),t("h3",{attrs:{id:"locality"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#locality"}},[e._v("#")]),e._v(" Locality")]),e._v(" "),t("p",[e._v("Network bandwidth is a relatively scarce resource in our computing environment.")]),e._v(" "),t("p",[e._v("We conserve network bandwidth by taking advantage of the fact that the input data (managed by GFS [8]) is stored on the local disks of the machines that make up our cluster.")]),e._v(" "),t("h3",{attrs:{id:"task-granularity"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#task-granularity"}},[e._v("#")]),e._v(" Task Granularity")]),e._v(" "),t("p",[e._v("We subdivide the map phase into M pieces and the reduce phase into R pieces, as described above.")]),e._v(" "),t("h3",{attrs:{id:"backup-tasks"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#backup-tasks"}},[e._v("#")]),e._v(" Backup Tasks")]),e._v(" "),t("h2",{attrs:{id:"refinements"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#refinements"}},[e._v("#")]),e._v(" Refinements")]),e._v(" "),t("h3",{attrs:{id:"partitioning-function"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#partitioning-function"}},[e._v("#")]),e._v(" Partitioning Function")]),e._v(" "),t("p",[e._v("The users of MapReduce specify the number of reduce tasks/output files that they desire (R).")]),e._v(" "),t("h3",{attrs:{id:"ordering-guarantees"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ordering-guarantees"}},[e._v("#")]),e._v(" Ordering Guarantees")]),e._v(" "),t("p",[e._v("This ordering guarantee makes it easy to generate a sorted output file per partition,")]),e._v(" "),t("h3",{attrs:{id:"combiner-function"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#combiner-function"}},[e._v("#")]),e._v(" Combiner Function")]),e._v(" "),t("p",[e._v("We allow the user to specify an optional Combiner function that does partial merging of this data before it is sent over the network.")]),e._v(" "),t("p",[e._v("The Combiner function is executed on each machine that performs a map task.")]),e._v(" "),t("p",[e._v("What is the difference between a reduce function and a combiner function？")]),e._v(" "),t("p",[e._v("The only difference between a reduce function and a combiner function is how the MapReduce library handles the output of the function.")]),e._v(" "),t("ul",[t("li",[e._v("The output of a reduce function is written to the final output file.")]),e._v(" "),t("li",[e._v("The output of a combiner function is written to an intermediate file that will be sent to a reduce task.")])]),e._v(" "),t("p",[e._v("Partial combining significantly speeds up certain classes of MapReduce operations.")]),e._v(" "),t("h3",{attrs:{id:"input-and-output-types"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#input-and-output-types"}},[e._v("#")]),e._v(" Input and Output Types")]),e._v(" "),t("p",[e._v("The MapReduce library provides support for reading input data in several different formats.")]),e._v(" "),t("h3",{attrs:{id:"side-effects"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#side-effects"}},[e._v("#")]),e._v(" Side-effects")]),e._v(" "),t("p",[e._v("In some cases, users of MapReduce have found it convenient to produce auxiliary files as additional outputs from their map and/or reduce operators.")]),e._v(" "),t("p",[e._v("We do not provide support for atomic two-phase commits of multiple output files produced by a single task.")]),e._v(" "),t("h3",{attrs:{id:"skipping-bad-records"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#skipping-bad-records"}},[e._v("#")]),e._v(" Skipping Bad Records")]),e._v(" "),t("p",[e._v("We provide an optional mode of execution where the MapReduce library detects which records cause deterministic crashes and skips these records in order to make forward progress.")]),e._v(" "),t("h3",{attrs:{id:"local-execution"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#local-execution"}},[e._v("#")]),e._v(" Local Execution")]),e._v(" "),t("p",[e._v("To help facilitate debugging, profiling, and small-scale testing, we have developed an alternative implementation of the MapReduce library that sequentially executes all of the work for a MapReduce operation on the local machine.")]),e._v(" "),t("h3",{attrs:{id:"status-information"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#status-information"}},[e._v("#")]),e._v(" Status Information")]),e._v(" "),t("p",[e._v("The master runs an internal HTTP server and exports a set of status pages for human consumption.")]),e._v(" "),t("h3",{attrs:{id:"counters"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#counters"}},[e._v("#")]),e._v(" Counters")]),e._v(" "),t("p",[e._v("The MapReduce library provides a "),t("strong",[e._v("counter facility")]),e._v(" to count occurrences of various events.")]),e._v(" "),t("p",[e._v("The counter values from individual worker machines are periodically propagated to the master (piggybacked on the ping response). The master aggregates the counter values from successful map and reduce tasks and returns them to the user code when the MapReduce operation is completed.")]),e._v(" "),t("p",[e._v("Users have found the counter facility useful for sanity checking the behavior of MapReduce operations.")]),e._v(" "),t("h2",{attrs:{id:"performance"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#performance"}},[e._v("#")]),e._v(" Performance")]),e._v(" "),t("p",[e._v("In this section we measure the performance of MapReduce on two computations running on a large cluster of machines. One computation searches through approximately one terabyte of data looking for a particular pattern. The other computation sorts approximately one terabyte of data.")]),e._v(" "),t("h2",{attrs:{id:"experience"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#experience"}},[e._v("#")]),e._v(" Experience")]),e._v(" "),t("h3",{attrs:{id:"large-scale-indexing"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#large-scale-indexing"}},[e._v("#")]),e._v(" Large-Scale Indexing")]),e._v(" "),t("p",[e._v("One of our most significant uses of MapReduce to date has been a complete rewrite of the production indexing system that produces the data structures used for the Google web search service.")]),e._v(" "),t("h2",{attrs:{id:"related-work"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#related-work"}},[e._v("#")]),e._v(" Related Work")]),e._v(" "),t("blockquote",[t("p",[e._v("This chapter introduces the related work and makes a comparison between this work and other related work.")])]),e._v(" "),t("p",[e._v("Many systems have provided restricted programming models and used the restrictions to parallelize the computation automatically.")]),e._v(" "),t("p",[e._v("More significantly, we provide a fault-tolerant implementation that scales to thousands of processors.")]),e._v(" "),t("p",[e._v("In contrast, most of the parallel processing systems have only been implemented on smaller scales and leave the details of handling machine failures to the programmer.")]),e._v(" "),t("h2",{attrs:{id:"conclusions"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#conclusions"}},[e._v("#")]),e._v(" Conclusions")]),e._v(" "),t("p",[e._v("The MapReduce programming model has been successfully used at Google for many different purposes.")]),e._v(" "),t("ul",[t("li",[e._v("First, the model is easy to use, even for programmers without experience with parallel and distributed systems, since it hides the details of parallelization, fault-tolerance, locality optimization, and load balancing.")]),e._v(" "),t("li",[e._v("Second, a large variety of problems are easily expressible as MapReduce computations.")]),e._v(" "),t("li",[e._v("Third, we have developed an implementation of MapReduce that scales to large clusters of machines comprising thousands of machines.")])]),e._v(" "),t("p",[e._v("We have learned several things from this work.")]),e._v(" "),t("ul",[t("li",[e._v("First, restricting the programming model makes it easy to parallelize and distribute computations and to make such computations fault-tolerant.")]),e._v(" "),t("li",[e._v("Second, network bandwidth is a scarce resource.")])]),e._v(" "),t("blockquote",[t("p",[e._v("A number of optimizations in our system are therefore targeted at reducing the amount of data sent across the network: the locality optimization allows us to read data from local disks, and writing a single copy of the intermediate data to local disk saves network bandwidth.")])]),e._v(" "),t("ul",[t("li",[e._v("Third, redundant execution can be used to reduce the impact of slow machines, and to handle machine failures and data loss.")])]),e._v(" "),t("h2",{attrs:{id:"acknowledgements"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#acknowledgements"}},[e._v("#")]),e._v(" Acknowledgements")]),e._v(" "),t("h2",{attrs:{id:"references"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#references"}},[e._v("#")]),e._v(" References")]),e._v(" "),t("h2",{attrs:{id:"references-2"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#references-2"}},[e._v("#")]),e._v(" References'")]),e._v(" "),t("ol",[t("li",[e._v("Video: https://www.youtube.com/watch?v=WtZ7pcRSkOA&feature=youtu.be")]),e._v(" "),t("li",[e._v("Lecture Notes: http://nil.csail.mit.edu/6.824/2022/notes/l01.txt")]),e._v(" "),t("li",[e._v("Paper: http://nil.csail.mit.edu/6.824/2022/papers/mapreduce.pdf")])]),e._v(" "),t("h2",{attrs:{id:"q-a"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#q-a"}},[e._v("#")]),e._v(" Q & A")]),e._v(" "),t("p",[e._v("e.g. Word count")]),e._v(" "),t("ol",[t("li",[e._v("Input is already split into M files")]),e._v(" "),t("li",[e._v('MR calls Map() for each input file, produces sets of k2, v2 "intermediate" data')])]),e._v(" "),t("blockquote",[t("p",[e._v('Each Map() call is a "task"')])]),e._v(" "),t("ol",[t("li",[e._v("When Maps are done, MR gathers all intermediate v2's for a given k2, and passes each key + values to a Reduce call")]),e._v(" "),t("li",[e._v("Final output is sets of <k2,v3> pairs from Reduce()s")])]),e._v(" "),t("p",[t("strong",[e._v("MapReduce hides many details")])]),e._v(" "),t("ol",[t("li",[e._v("Sending app code to servers")]),e._v(" "),t("li",[e._v("Tracking which tasks have finished")]),e._v(" "),t("li",[e._v('"shuffling" intermediate data from Maps to Reduces')]),e._v(" "),t("li",[e._v("Balancing load over servers")]),e._v(" "),t("li",[e._v("Recovering from failures")])]),e._v(" "),t("p",[t("strong",[e._v("However, MapReduce limits what apps can do")])]),e._v(" "),t("ol",[t("li",[e._v("No interaction or state (other than via intermediate output).")]),e._v(" "),t("li",[e._v("No iteration")]),e._v(" "),t("li",[e._v("No real-time or streaming processing.")])]),e._v(" "),t("p",[t("strong",[e._v("Input and output are stored on the GFS cluster file system")])]),e._v(" "),t("ol",[t("li",[e._v("MR needs huge parallel input and output throughput.")]),e._v(" "),t("li",[e._v("GFS splits files over many servers, in 64 MB chunks")]),e._v(" "),t("li",[e._v("Maps read in parallel")]),e._v(" "),t("li",[e._v("Reduces write in parallel")]),e._v(" "),t("li",[e._v("GFS also replicates each file on 2 or 3 servers")]),e._v(" "),t("li",[e._v("GFS is a big win for MapReduce")])]),e._v(" "),t("p",[t("strong",[e._v("Some details (paper's Figure 1)")])]),e._v(" "),t("p",[e._v("one coordinator, that hands out tasks to workers and remembers progress.")]),e._v(" "),t("ol",[t("li",[e._v("coordinator gives Map tasks to workers until all Maps complete     Maps write output (intermediate data) to local disk     Maps split output, by hash, into one file per Reduce task")]),e._v(" "),t("li",[e._v("After all Maps have finished, coordinator hands out Reduce tasks     each Reduce fetches its intermediate output from (all) Map workers     each Reduce task writes a separate output file on GFS")])]),e._v(" "),t("p",[t("strong",[e._v("What will likely limit the performance?")])]),e._v(" "),t("p",[e._v("In 2004 authors were limited by network capacity. What does MR send over the network?")]),e._v(" "),t("ol",[t("li",[e._v("Maps read input from GFS.")]),e._v(" "),t("li",[e._v("Reduces read Map intermediate output.")]),e._v(" "),t("li",[e._v("Often as large as input, e.g. for sorting.")]),e._v(" "),t("li",[e._v("Reduces write output files to GFS.")]),e._v(" "),t("li",[e._v("[diagram: servers, tree of network switches]")]),e._v(" "),t("li",[e._v("In MR's all-to-all shuffle, half of traffic goes through root switch. Paper's root switch: 100 to 200 gigabits/second, total 1800 machines, so 55 megabits/second/machine. 55 is small:  much less than disk or RAM speed.  Today: networks are much faster")])]),e._v(" "),t("p",[t("strong",[e._v("How does MR minimize network use?")])]),e._v(" "),t("ul",[t("li",[t("p",[e._v("Coordinator tries to run each Map task on GFS server that stores its input.")])]),e._v(" "),t("li",[t("p",[e._v("All computers run both GFS and MR workers.")])]),e._v(" "),t("li",[t("p",[e._v("So input is read from local disk (via GFS), not over network.")])])]),e._v(" "),t("p",[e._v("Intermediate data goes over network just once.")]),e._v(" "),t("p",[e._v("Map worker writes to local disk.")]),e._v(" "),t("p",[e._v("Reduce workers read from Map worker disks over the network.")]),e._v(" "),t("p",[e._v("Storing it in GFS would require at least two trips over the network.")]),e._v(" "),t("p",[e._v("Intermediate data partitioned into files holding many keys.")]),e._v(" "),t("p",[e._v("R is much smaller than the number of keys.")]),e._v(" "),t("p",[e._v("Big network transfers are more efficient.")]),e._v(" "),t("p",[t("strong",[e._v("How does MR get good load balance?")])]),e._v(" "),t("p",[e._v("Wasteful and slow if N-1 servers have to wait for 1 slow server to finish.")]),e._v(" "),t("p",[e._v("But some tasks likely take longer than others.")]),e._v(" "),t("p",[e._v("Solution: many more tasks than workers.    Coordinator hands out new tasks to workers who finish previous tasks.    So no task is so big it dominates completion time (hopefully).    So faster servers do more tasks than slower ones, finish abt the same time.")]),e._v(" "),t("p",[t("strong",[e._v("What about fault tolerance?")])]),e._v(" "),t("p",[e._v("MR re-runs just the failed Map()s and Reduce()s.")]),e._v(" "),t("ul",[t("li",[t("p",[e._v("Suppose MR runs a Map twice, one Reduce sees first run's output, another Reduce sees the second run's output?")])]),e._v(" "),t("li",[t("p",[e._v("Correctness requires re-execution to yield exactly the same output.")])]),e._v(" "),t("li",[t("p",[e._v("So Map and Reduce must be pure deterministic functions: they are only allowed to look at their      arguments/input. no state, no file I/O, no interaction, no external communication.")])]),e._v(" "),t("li",[t("p",[e._v("What if you wanted to allow non-functional Map or Reduce?")])]),e._v(" "),t("li",[t("p",[e._v("Worker failure would require whole job to be re-executed, or you'd need to roll back to some kind of global checkpoint.")])])]),e._v(" "),t("p",[t("strong",[e._v("Details of worker crash recovery")])]),e._v(" "),t("p",[e._v("a Map worker crashes:")]),e._v(" "),t("p",[e._v("coordinator notices worker no longer responds to pings")]),e._v(" "),t("p",[e._v("coordinator knows which Map tasks ran on that worker")]),e._v(" "),t("p",[e._v("those tasks' intermediate output is now lost, must be re-created")]),e._v(" "),t("p",[e._v("coordinator tells other workers to run those tasks")]),e._v(" "),t("p",[e._v("can omit re-running if all Reduces have fetched the intermediate data")]),e._v(" "),t("p",[e._v("a Reduce worker crashes:")]),e._v(" "),t("p",[e._v("finished tasks are OK -- stored in GFS, with replicas.")]),e._v(" "),t("p",[e._v("coordinator re-starts worker's unfinished tasks on other workers.")]),e._v(" "),t("p",[e._v("Other failures/problems")]),e._v(" "),t("ul",[t("li",[e._v("What if the coordinator gives two workers the same Map() task?\nperhaps the coordinator incorrectly thinks one worker died.\nit will tell Reduce workers about only one of them.")]),e._v(" "),t("li",[e._v("What if the coordinator gives two workers the same Reduce() task?\nthey will both try to write the same output file on GFS!\natomic GFS rename prevents mixing; one complete file will be visible.")]),e._v(" "),t("li",[e._v('What if a single worker is very slow -- a "straggler"?\nperhaps due to flakey hardware.\ncoordinator starts a second copy of last few tasks.')]),e._v(" "),t("li",[e._v('What if a worker computes incorrect output, due to broken h/w or s/w?\ntoo bad! MR assumes "fail-stop" CPUs and software.')]),e._v(" "),t("li",[e._v("What if the coordinator crashes?")])]),e._v(" "),t("p",[e._v("Current status?\nHugely influential (Hadoop, Spark, &c).\nProbably no longer in use at Google.\nReplaced by Flume / FlumeJava (see paper by Chambers et al).\nGFS replaced by Colossus (no good description), and BigTable.")])])}),[],!1,null,null,null);t.default=s.exports}}]);