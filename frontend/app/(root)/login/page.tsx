import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main
      className={
        "bg-charcoalBlack items-center justify-center flex py-20 align-middle lg:py-24"
      }
    >
      <section
        className={
          "p-6 max-w-[480px] bg-deepGray rounded-2xl md:p-8 lg:p-12 w-full " +
          "shadow-[0px_8px_24px_rgba(0,_0,_0,_0.3)] "
        }
      >
        {/* Header Part */}
        <div className="flex flex-col justify-between items-center">
          <Image
            src={"/images/weblogo.png"}
            alt={"Website Logo"}
            height={32}
            width={32}
            className="mb-6 h-6 w-auto md:h-7 lg:h-8 "
          />
          <h1
            className={
              "font-author mb-4 font-bold text-xl leading-6 text-warmBeige text-center md:text-2xl lg:text-[28px] md:leading-[30px] lg:leading-9  "
            }
          >
            Welcome Back!
          </h1>
          <h3
            className={
              "font-generalSans text-[12px] leading-4 text-mutedSand text-center mb-6 md:text-[14px] lg:text-[16px] md:leading-5 lg:leading-6 "
            }
          >
            Sign in to access your account and continue exploring.
          </h3>
        </div>
        <form
          action=""
          className={"flex flex-col border-b border-charcoalBlack "}
        >
          <label
            className={
              "font-generalSans font-bold text-warmBeige text-[10px] text-left mb-2 md:text-[12px] lg:text-[14px] "
            }
          >
            Email Address
          </label>
          <input
            type="email"
            className={
              "bg-slightlyLightGrey border border-darkMocha rounded-[8px] font-generalSans text-mutedSand mb-4 text-[12px] md:text-[14px] lg:text-[16px] py-2 px-2.5 w-full md:py-2.5 lg:py-3 md:px-3 lg:px-4 " +
              "focus:border-burntAmber focus:outline-none"
            }
          />
          <label
            className={
              "font-generalSans font-bold text-warmBeige text-[10px] text-left mb-2 md:text-[12px] lg:text-[14px] "
            }
          >
            Password
          </label>
          <input
            type="password"
            className={
              "bg-slightlyLightGrey border border-darkMocha rounded-[8px] font-generalSans text-mutedSand mb-4 text-[12px] md:text-[14px] lg:text-[16px] py-2 px-2.5 w-full md:py-2.5 lg:py-3 md:px-3 lg:px-4 " +
              "focus:border-burntAmber focus:outline-none"
            }
          />
          <button
            type="submit"
            className={
              "font-author font-bold text-[14px] leading-4 bg-burntAmber rounded-[8px] py-2 px-4 w-full text-warmBeige mb-4 md:text-[16px] md:leading-5 md:py-2.5 md:px-5 lg:text-lg lg:leading-6 lg:py-3 lg:px-6 " +
              "hover:bg-deepCopper active:scale-95 transform duration-100 "
            }
          >
            Login
          </button>
          <Link
            href={"/"}
            className={
              "font-generalSans text-burntAmber text-[10px] md:text-[12px] lg:text-[14px] mb-6 text-end " +
              "hover:text-deepCopper"
            }
          >
            Forgot Password?
          </Link>
        </form>
        <p
          className={
            "font-generalSans text-[10px] text-mutedSand text-center md:text-[12px] lg:text-[14px] hover"
          }
        >
          Don&lsquo;t have an account?{" "}
          <Link href={"../register"} className={"hover:text-burntAmber"}>
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
